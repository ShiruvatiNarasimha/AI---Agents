import asana
from asana.rest import ApiException
from openai import OpenAI
from dotenv import load_dotenv
from datetime import datetime
import json
import os

# Load environment variables from .env file
load_dotenv()

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

def create_asana_task(task_name, due_on="today", notes=""):
    """
    create a task in Asana give the name of the task and when it is due

    Example call:


    create_asana_task("Test Task", "2025-05-05")
    Args:
        task_name(str): The name of the task in Asana
        due_on (str): The date the task is due format YYYY-MM-DD. If not given, the current dayis used
        notes (str): Additional description for the task
    Returns:
    str: The API response of adding the task to asana or an error mesasage if the API call threw an error    
    """
    # If due_on is "today", set it to the current date
    if due_on == "today":
        due_on = str(datetime.now().date())

    # Create a task body with the required fields for Asana API
    task_body = {
        "data": {
            "name": task_name,
            "due_on": due_on,
            "notes": notes,
            "projects": [os.getenv("ASANA_PROJECT_ID", "")]  # Project ID from environment variables
        }
    }    

    try: 
        # Call Asana API to create the task
        api_response = tasks_api.create_task(task_body, {})
        return json.dumps(api_response, indent=2)  # Return the response as a formatted JSON string
    except ApiException as e:
        # Return error message if API call fails
        return f"Exception when calling TasksApi->create_task: {e}"

def get_asana_tasks(limit=10):
    """
    Get a list of tasks from the Asana project
    
    Args:
        limit (int): Maximum number of tasks to return
    
    Returns:
        str: JSON string containing tasks or error message
    """
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
            
        return json.dumps(detailed_tasks, indent=2)
    except ApiException as e:
        return f"Exception when calling Asana API: {e}"

def update_asana_task(task_id, task_name=None, due_on=None, completed=None, notes=None):
    """
    Update an existing Asana task
    
    Args:
        task_id (str): The Asana task GID to update
        task_name (str, optional): New name for the task
        due_on (str, optional): New due date in YYYY-MM-DD format
        completed (bool, optional): Whether the task is completed
        notes (str, optional): Updated notes for the task
    
    Returns:
        str: JSON response of the update or error message
    """
    # Build data dict with only provided fields
    data = {}
    if task_name is not None:
        data["name"] = task_name
    if due_on is not None:
        data["due_on"] = due_on
    if completed is not None:
        data["completed"] = completed
    if notes is not None:
        data["notes"] = notes
    
    # If no fields to update, return early
    if not data:
        return "No update parameters provided"
    
    task_body = {"data": data}
    
    try:
        api_response = tasks_api.update_task(task_id, task_body, {})
        return json.dumps(api_response, indent=2)
    except ApiException as e:
        return f"Exception when updating task: {e}"

def add_comment_to_task(task_id, comment_text):
    """
    Add a comment to an Asana task
    
    Args:
        task_id (str): The Asana task GID
        comment_text (str): The comment to add
    
    Returns:
        str: JSON response or error message
    """
    try:
        story_body = {
            "data": {
                "text": comment_text
            }
        }
        api_response = stories_api.create_story_for_task(task_id, story_body, {})
        return json.dumps(api_response, indent=2)
    except ApiException as e:
        return f"Exception when adding comment: {e}"

def search_asana_tasks(query):
    """
    Search for tasks by keyword
    
    Args:
        query (str): Search terms
    
    Returns:
        str: JSON response or error message
    """
    workspace_id = os.getenv("ASANA_WORKSPACE_ID", "")
    try:
        search_params = {
            "text": query,
            "resource_type": "task",
            "opt_fields": "name,due_on,completed,assignee"
        }
        api_response = asana.SearchApi(api_client).search_tasks_for_workspace(workspace_id, search_params)
        return json.dumps(api_response, indent=2)
    except ApiException as e:
        return f"Exception when searching tasks: {e}"

def get_tools():
    # Define tools (functions) that the AI can use
    # This follows OpenAI's function calling format
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
        {
            "type": "function",
            "function": {
                "name": "get_asana_tasks",
                "description": "Get a list of tasks from your Asana project",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "limit": {
                            "type": "integer",
                            "description": "Maximum number of tasks to retrieve"
                        }
                    }
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "update_asana_task",
                "description": "Update an existing Asana task details",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {
                            "type": "string",
                            "description": "The Asana task GID to update"
                        },
                        "task_name": {
                            "type": "string",
                            "description": "New name for the task"
                        },
                        "due_on": {
                            "type": "string",
                            "description": "New due date in YYYY-MM-DD format"
                        },
                        "completed": {
                            "type": "boolean",
                            "description": "Mark task as completed (true) or incomplete (false)"
                        },
                        "notes": {
                            "type": "string",
                            "description": "Updated notes for the task"
                        }
                    },
                    "required": ["task_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "add_comment_to_task",
                "description": "Add a comment to an existing Asana task",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {
                            "type": "string",
                            "description": "The Asana task GID"
                        },
                        "comment_text": {
                            "type": "string",
                            "description": "The comment text to add to the task"
                        }
                    },
                    "required": ["task_id", "comment_text"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "search_asana_tasks",
                "description": "Search for tasks by keyword",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "Search terms to find relevant tasks"
                        }
                    },
                    "required": ["query"]
                }
            }
        }
    ]
    return tools

def prompt_ai(messages):
    # Send the conversation to OpenAI API with our defined tools
    completion = client.chat.completions.create(
        model=model,
        messages=messages,
        tools=get_tools(),
    )
    
    # Extract the response message and any tool calls
    response_message = completion.choices[0].message
    tool_calls = response_message.tool_calls


    if tool_calls:
        # If the AI wants to use tools (like creating an Asana task)
        
        # Map function names to actual Python functions
        available_functions = {
            "create_asana_task": create_asana_task,
            "get_asana_tasks": get_asana_tasks,
            "update_asana_task": update_asana_task,
            "add_comment_to_task": add_comment_to_task,
            "search_asana_tasks": search_asana_tasks
        }


        # Add AI's response to the conversation history
        messages.append(response_message)


        # Process each tool call requested by the AI
        for tool_call in tool_calls:
            function_name = tool_call.function.name
            function_to_call = available_functions[function_name]
            function_args = json.loads(tool_call.function.arguments)
            # Execute the function with the arguments provided by the AI
            function_response = function_to_call(**function_args)

            # Add the tool response to the conversation history
            messages.append({
                "tool_call_id": tool_call.id,
                "role": "tool",
                "name": function_name,
                "content": function_response
            })

        # Call the AI again with the tool results to get a final response
        second_response = client.chat.completions.create(
            model=model,
            messages=messages,
        )

        return second_response.choices[0].message.content

    # If no tools were called, just return the AI's response
    return response_message.content

def main():
    # Initialize conversation with a system message defining the AI's role
    messages = [
        {
            "role": "system",
            "content": f"""You are a personal assistant who helps manage tasks in Asana. 
The current date is: {datetime.now().date()}
You can help users with the following actions:
1. Create new tasks with names, due dates, and notes
2. View existing tasks in their project
3. Update task details like name, due date, or completion status
4. Add comments to tasks
5. Search for specific tasks

Always provide helpful, concise responses. When creating or updating tasks, confirm the details before proceeding."""
        }
    ]

    # Main conversation loop
    while True:
        user_input = input("Chat with AI (q to quit): ").strip()
        
        # Exit loop if user types 'q'
        if user_input == 'q':
            break  

        # Add user message to conversation history
        messages.append({"role": "user", "content": user_input})
        # Get AI response
        ai_response = prompt_ai(messages)

        # Display AI response and add it to conversation history
        print(ai_response)
        messages.append({"role": "assistant", "content": ai_response})


# Entry point - run the main function when script is executed directly
if __name__ == "__main__":
    main()