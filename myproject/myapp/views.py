from django.shortcuts import render, HttpResponse, redirect
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import login as auth_login
from django.conf import settings
import os
from langchain_openai import OpenAI
from .constants import openai_key

import base64
from io import BytesIO
import subprocess
import os,io
import requests
import base64
from PIL import Image
import matplotlib.pyplot as plt
import time
from asgiref.sync import sync_to_async


def landing(request):
    return render(request, 'landing.html')

def login_user(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            user = form.get_user()
            auth_login(request, user)
            return redirect('prompt')  # Redirect to the 'prompt' page after login
        else:
            # Display an error message if login fails
            error_message = "Invalid username or password."
            return render(request, 'login.html', {'form': form, 'error_message': error_message})
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})

def signup_user(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            auth_login(request, user)

            # Debug print statements
            print(f"User created: {user.username}, {user.email}")
            
            return redirect('prompt')  # Redirect to the 'prompt' page after signup
        else:
            print("Form is not valid:", form.errors)
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})
    
def prompt(request):
    if request.method == "GET":
        return render(request, 'prompt.html')
    elif request.method == "POST":
        # Handle the POST request if needed
        return HttpResponse("POST request handling not implemented")
    else:
        return HttpResponse("Method prompt not allowed")

def rankings(request):
    if request.method == "GET":
        text=request.GET.get('prompt', '')
        prompt_list = generate_descriptions(text)
        for phrase in prompt_list:
            phrase=phrase[4:-1]
        # print(prompts)
        # return HttpResponse(prompts)
        return render(request, 'rankings.html', {'prompts': prompt_list})
    else:
        # return render(request, 'generate.html')
        return HttpResponse("Post not handled")
        
@sync_to_async
def generate(request):
    prompt_text = request.GET.get('prompt_text', '')
    selected_text_value = prompt_text

    # Pass the selected text to the template context
    context = {
        'selected_text': selected_text_value
    }

    # Get the generated image data
    generated_image = pass_to_sdm(selected_text_value)
    if generated_image:
        # Convert the image to base64-encoded string
        buffered = BytesIO()
        generated_image.save(buffered, format="PNG")
        image_str = base64.b64encode(buffered.getvalue()).decode()

        # Get the directory of the current script
        script_dir = os.path.dirname(os.path.realpath(__file__))

        # Save the image to the '2Dimage' folder in the script directory
        image_folder = os.path.join(script_dir, '2Dimage')
        os.makedirs(image_folder, exist_ok=True)
        image_filename = "generatedImage.png"
        image_path = os.path.join(image_folder, image_filename)
        generated_image.save(image_path)

        # Add the base64-encoded image data to the context
        context['generated_image'] = image_str

    return render(request, 'generate.html', context)



def gen3d(request):
    if request.method == "GET":
        try:
            # Define the default image location
            default_image_location = r"D:\StableDiffusion\TextGenerationCompleted\myproject\myapp\2Dimage\generatedImage.png"
            default_save_location = r"D:\StableDiffusion\TextGenerationCompleted\myproject\myapp\outputs"

            # Run the modified run.py script with the default image location as an argument
            script_path = r"D:\StableDiffusion\TextGenerationCompleted\myproject\myapp\run.py"
            print("Script path:", script_path)
            subprocess.run(["python", script_path, default_image_location,"--output-dir", default_save_location], check=True)

            return HttpResponse("3D model generation complete.")
        except subprocess.CalledProcessError as e:
            # return HttpResponse(f"Error: {e}")
            return render(request,"gen3d.html")
    else:
        return HttpResponse("Method not allowed")


def generate_descriptions(input_prompt):
    llm = OpenAI(openai_api_key=openai_key)

    print("The input prompt recieved is:",input_prompt)
    print("\n\n")
    template="Suggest three image-generatable text descriptions for the following input prompt in less than 15 words which is to be passed into a Stable Diffusion model for image-generation: "
    
    question=template+input_prompt
    print(question)
    result=(llm.invoke(question))
    result_list=result.split("\n")


    important_list = [phrase for phrase in result_list if phrase.strip()]
    
    print("\n\nThese are the result prompts generated:")
    print(important_list)
    return important_list


def pass_to_sdm(selected_prompt):
    def decode_base64_image(base64_string):
        decoded_bytes = base64.b64decode(base64_string)
        return Image.open(io.BytesIO(decoded_bytes))

    # Define the API endpoint and payload
    api_url = "http://127.0.0.1:7861/sdapi/v1/txt2img"
    payload = {
        "prompt": selected_prompt,
        "steps": 20
    }

    try:
        print("Waiting to generate image data :)")
        response = requests.post(api_url, json=payload)

        if response.status_code == 200:
            image_data_base64 = response.json()['images'][0]
            image = decode_base64_image(image_data_base64)
            return image
        else:
            print("Error:", response.text)

    except requests.exceptions.RequestException as e:
        print("Error making API request:", e)
