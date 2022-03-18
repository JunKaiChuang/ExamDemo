from rest_framework import serializers
from membership.models import Member


class MemberSerializer(serializers.Serializer):
    created = serializers.DateTimeField(required=False)
    id = serializers.CharField(required=True, allow_null=False, allow_blank=False, max_length=100)
    name = serializers.CharField()
    loginsCount = serializers.IntegerField(required=False)
    lastLogin = serializers.DateTimeField(required=False)
    lastSession = serializers.DateTimeField(required=False)

    def create(self, validated_data):
        return Member.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.loginsCount = validated_data.get('loginsCount', instance.loginsCount)
        instance.lastLogin = validated_data.get('lastLogin', instance.lastLogin)
        instance.lastSession = validated_data.get('lastSession', instance.lastSession)
        instance.save()
        return instance
