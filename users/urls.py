
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ArtistProfileViewSet, RegisterView

router = DefaultRouter()
router.register('profiles', ArtistProfileViewSet)

urlpatterns = router.urls  + [
    path('register/', RegisterView.as_view(), name='register'),
]