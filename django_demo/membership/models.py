from collections import namedtuple
from django.db import models
from django.db import connection


def named_tuple_fetch_all(cursor):
    # Return all rows from a cursor as a namedtuple
    desc = cursor.description
    nt_result = namedtuple('Result', [col[0] for col in desc])
    return [nt_result(*row) for row in cursor.fetchall()]


def get_members_info():
    with connection.cursor() as cursor:
        cursor.execute("""select *
                            from (
                            	select count(*) as SingUpCount
                            	from membership_member
                            )a
                            join (
                            	select count(*) as ToDayAlive
                            	from membership_member
                            	where date(lastSession) = date(date('now'))
                            )b on 1=1
                            join (
                            	select count(*) as Last7DaysAlice
                            	from membership_member
                            	where JulianDay(date(date('now'))) -  JulianDay(date(lastSession)) <= 7
                            )c
                            ;""")
        result = named_tuple_fetch_all(cursor)
    result = [
        {
            'SingUpCount': r.SingUpCount,
            'ToDayAlive': r.ToDayAlive,
            'Last7DaysAlice': r.Last7DaysAlice
        }
        for r in result
    ]

    return result


class Member(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    id = models.CharField(max_length=100, blank=False, primary_key=True)
    name = models.CharField(max_length=50, null=True, default='')
    loginsCount = models.IntegerField(null=True)
    lastLogin = models.DateTimeField(null=True)
    lastSession = models.DateTimeField(null=True)

    class Meta:
        ordering = ['created']

