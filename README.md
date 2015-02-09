README.md v1.3, 9 April 2014 [ogl, adriancollier]

# Akvo Really Simple Reporting (Akvo RSR)

Akvo Foundation is a non-profit foundation that builds open source internet and mobile phone software which is used to make international development cooperation and governance more effective and transparent.

Akvo RSR is part of the Akvo platform. Akvo RSR is a web and Android-based system that makes it easy for international development teams to bring complex networks of projects online and instantly share progress with everyone involved and interested.

We believe that Akvo RSR can be used in many other scenarios, including environmental programs and monitoring.

Read more about [Akvo Products](http://akvo.org/products/).

More information in these files:

* [RELEASE_NOTES](RELEASE_NOTES.md)
* [AUTHORS](AUTHORS.txt)
* [LICENSE](LICENSE.md)
* [INSTALL](INSTALL.md)


 
## From checkout to running dev server

```shell
$ cd akvo/settings
$ cp ./66_local.template ./66_local.conf
$ cd ../../vagrant
$ vagrant up --provider=virtualbox
$ cd ../scripts/devhelpers
$ ./supervisord.sh stop rsr && ./manage.sh runserver
```

Now open a browser and visist [http://rsr.localdev.akvo.org/](http://rsr.localdev.akvo.org/).