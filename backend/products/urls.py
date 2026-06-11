from django.urls import path
from . import views

urlpatterns = [
    path('api/products/', views.get_products, name='get_products'),
    path('api/banners/', views.get_banners, name='get_banners'),
]

