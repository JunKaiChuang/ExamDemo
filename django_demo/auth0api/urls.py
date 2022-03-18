from django.urls import path
from auth0api import views


urlpatterns = [
    path('auth0api/user_detail/<str:uid>/', views.user_detail),
    path('auth0api/resend_mail/', views.re_send_mail),
    path('auth0api/re_set_password/', views.re_set_password)
]
