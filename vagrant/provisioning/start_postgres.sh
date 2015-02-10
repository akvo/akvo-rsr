# For whatever reason, postgres is unable to bind to the assigned IP
# address at the time the vagrant box starts up. Presumably networking
# is not ready at that point. Therefore it will fail, so we force it
# to start here.
/etc/init.d/postgresql start