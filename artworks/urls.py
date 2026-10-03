from rest_framework.routers import DefaultRouter
from .views import ArtworkViewSet

router = DefaultRouter()
router.register('artworks', ArtworkViewSet)

urlpatterns = router.urls