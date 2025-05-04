import asana
from asana.rest import ApiException
from openai import OpenAI
from dotenv import load_dotenv
from datetime import datetime
import json
import os
from twilio.rest import Client
from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Asana-WhatsApp Assistant API")

# Add CORS middleware to allow frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the OpenAI client
client = OpenAI()
# Set the OpenAI model to use (default is gpt-4o if not specified in .env)
model = os.getenv('OPENAI_MODEL', 'gpt-4o')

# Set up Asana API configuration with access token from environment variables
configuration = asana.Configuration()
configuration.access_token = os.getenv('ASANA_ACCESS_TOKEN', '')
api_client = asana.ApiClient(configuration)

# Create instances of the Asana APIs
tasks_api = asana.TasksApi(api_client)
stories_api = asana.StoriesApi(api_client)
projects_api = asana.ProjectsApi(api_client)

# Initialize Twilio client for WhatsApp
twilio_account_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN", "")
twilio_client = Client(twilio_account_sid, twilio_auth_token)
whatsapp_from = os.getenv("TWILIO_WHATSAPP_FROM", "")

# Define API request/response models
class TaskCreate(BaseModel):
    task_name: str
    due_on: Optional[str] = "today"
    notes: Optional[str] = ""

class TaskUpdate(BaseModel):
    task_id: str
    task_name: Optional[str] = None
    due_on: Optional[str] = None
    completed: Optional[bool] = None
    notes: Optional[str] = None

class Comment(BaseModel):
    task_id: str
    comment_text: str

class WhatsAppMessage(BaseModel):
    to: str
    message: str

class TaskNotification(BaseModel):
    to: str
    task_name: str
    status: Optional[str] = "created"
    due_date: Optional[str] = None

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

@app.post("/tasks/create")
async def create_task(task: TaskCreate):
    """Create a new Asana task"""
    try:
        # If due_on is "today", set it to the current date
        due_on = task.due_on
        if due_on == "today":
            due_on = str(datetime.now().date())

        # Create a task body with the required fields for Asana API
        task_body = {
            "data": {
                "name": task.task_name,
                "due_on": due_on,
                "notes": task.notes,
                "projects": [os.getenv("ASANA_PROJECT_ID", "")]
            }
        }

        # Call Asana API to create the task
        api_response = tasks_api.create_task(task_body, {})
        return api_response
    except ApiException as e:
        # Return error message if API call fails
        raise HTTPException(status_code=400, detail=f"Error creating task: {str(e)}")

@app.get("/tasks")
async def get_tasks(limit: int = 10):
    """Get a list of tasks from the Asana project"""
    project_id = os.getenv("ASANA_PROJECT_ID", "")
    
    try:
        # Get tasks for the project
        tasks = projects_api.get_tasks_for_project(project_id, {"limit": limit})
        
        # Fetch detailed info for each task
        detailed_tasks = []
        for task in tasks:
            task_id = task['gid']
            task_info = tasks_api.get_task(task_id, {})
            detailed_tasks.append(task_info)
            
        return detailed_tasks
    except ApiException as e:
        raise HTTPException(status_code=400, detail=f"Error fetching tasks: {str(e)}")

@app.put("/tasks/update")
async def update_task(task: TaskUpdate):
    """Update an existing Asana task"""
    # Build data dict with only provided fields
    data = {}
    if task.task_name is not None:
        data["name"] = task.task_name
    if task.due_on is not None:
        data["due_on"] = task.due_on
    if task.completed is not None:
        data["completed"] = task.completed
    if task.notes is not None:
        data["notes"] = task.notes
    
    # If no fields to update, return early
    if not data:
        return {"message": "No update parameters provided"}
    
    task_body = {"data": data}
    
    try:
        api_response = tasks_api.update_task(task.task_id, task_body, {})
        return api_response
    except ApiException as e:
        raise HTTPException(status_code=400, detail=f"Error updating task: {str(e)}")

@app.post("/tasks/comment")
async def add_comment(comment: Comment):
    """Add a comment to an Asana task"""
    try:
        story_body = {
            "data": {
                "text": comment.comment_text
            }
        }
        api_response = stories_api.create_story_for_task(comment.task_id, story_body, {})
        return api_response
    except ApiException as e:
        raise HTTPException(status_code=400, detail=f"Error adding comment: {str(e)}")

@app.get("/tasks/search")
async def search_tasks(query: str):
    """Search for tasks by keyword"""
    workspace_id = os.getenv("ASANA_WORKSPACE_ID", "")
    try:
        search_params = {
            "text": query,
            "resource_type": "task",
            "opt_fields": "name,due_on,completed,assignee"
        }
        api_response = asana.SearchApi(api_client).search_tasks_for_workspace(workspace_id, search_params)
        return api_response
    except ApiException as e:
        raise HTTPException(status_code=400, detail=f"Error searching tasks: {str(e)}")

@app.post("/whatsapp/send")
async def send_message(message: WhatsAppMessage):
    """Send a WhatsApp message using Twilio"""
    to = message.to
    if not to.startswith("whatsapp:"):
        to = f"whatsapp:{to}"
    
    try:
        sent_message = twilio_client.messages.create(
            body=message.message,
            from_=whatsapp_from,
            to=to
        )
        return {"status": "success", "message_sid": sent_message.sid}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error sending WhatsApp message: {str(e)}")

@app.post("/whatsapp/notify")
async def notify_task(notification: TaskNotification):
    """Send a WhatsApp notification about a task update"""
    to = notification.to
    if not to.startswith("whatsapp:"):
        to = f"whatsapp:{to}"
    
    due_text = f" due on {notification.due_date}" if notification.due_date else ""
    message_body = f"Task update: '{notification.task_name}' has been {notification.status}{due_text}."
    
    try:
        sent_message = twilio_client.messages.create(
            body=message_body,
            from_=whatsapp_from,
            to=to
        )
        return {"status": "success", "message_sid": sent_message.sid}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error sending notification: {str(e)}")

def get_tools():
    """Define tools that AI can use"""
    tools = [
        {
            "type": "function",
            "function": {
                "name": "create_asana_task",
                "description": "Create a task in Asana given the name of the task and when it is due",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_name": {
                            "type": "string",
                            "description": "The name of the task in Asana"
                        },
                        "due_on": {
                            "type": "string",
                            "description": "The date the task is due format YYYY-MM-DD. If not given, the current day is used"
                        },
                        "notes": {
                            "type": "string",
                            "description": "Additional notes or description for the task"
                        }
                    },
                    "required": ["task_name"]
                }
            }
        },
        # Other tools definitions
        # (Skipping for brevity)
    ]
    return tools

@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    """Chat with the AI assistant"""
    try:
        # Format messages for OpenAI API
        formatted_messages = []
        for msg in request.messages:
            formatted_messages.append({"role": msg.role, "content": msg.content})
        
        # If this is a new conversation, add the system message
        if not any(msg.role == "system" for msg in request.messages):
            formatted_messages.insert(0, {
                "role": "system",
                "content": f"""You are a personal assistant who helps manage tasks in Asana and send WhatsApp messages. 
The current date is: {datetime.now().date()}
You can help users with creating tasks, viewing tasks, updating tasks, commenting on tasks, and sending messages."""
            })
        
        # Send request to OpenAI
        completion = client.chat.completions.create(
            model=model,
            messages=formatted_messages,
            tools=get_tools(),
        )
        
        # Extract response
        response_message = completion.choices[0].message
        
        # Handle tool calls
        if response_message.tool_calls:
            # This would need specialized handling on frontend
            # For simplicity, we'll just return that tools were requested
            return {
                "response": response_message.content,
                "has_tool_calls": True,
                "message": "Tool calls are handled on the backend. Please use specific API endpoints for task operations."
            }
        
        # Return simple text response
        return {"response": response_message.content, "has_tool_calls": False}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error chatting with AI: {str(e)}")

if __name__ == "__main__":
    # Run the API server with uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True) 