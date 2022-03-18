from django.urls import path
from membership import views


urlpatterns = [
    path('membership/get_dashboard_data/', views.get_dashboard_data)
]
