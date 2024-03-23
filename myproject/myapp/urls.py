# myapp/urls.py

from django.urls import path
from .views import *

urlpatterns = [
    path('', landing, name='landing'),
    path('login/', login_user, name='login'),
    path('signup/', signup_user, name='signup'),
    path('prompt/', prompt, name='prompt'),
    path('prompt/rankings.html', rankings, name='rankings'),
    path('generate/', generate, name='generate'),
    path('gen3d/', gen3d, name='gen3d'),
]
