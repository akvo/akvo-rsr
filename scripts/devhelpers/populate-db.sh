#!/bin/bash

docker-compose exec web python manage.py populate_db
