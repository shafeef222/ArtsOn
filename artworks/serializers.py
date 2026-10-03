from rest_framework import serializers
from .models import Artwork, Like, Comment

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'username', 'text', 'created_at']
        read_only_fields = ['user']

class ArtworkSerializer(serializers.ModelSerializer):
    artist_username = serializers.CharField(source='artist.username', read_only=True)
    likes_count = serializers.SerializerMethodField()
    liked_by_me = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Artwork
        fields = ['id', 'artist', 'artist_username', 'title', 'description',
                  'category', 'image', 'created_at', 'likes_count', 'liked_by_me', 'comments']
        read_only_fields = ['artist']

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_liked_by_me(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False