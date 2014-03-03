RAIN API

We have started an implementation with RAIN Foundation who will begin shortly to synchronise their PMS with Akvo RSR.

https://www.dropbox.com/s/obaq7iupsi2xjqk/RAIN%20process%20flow.jpg

As seen in the above diagram, the setup will include Akvo FLOW and RSR as well as also synchronising with the newly built website of RAIN.

* Surveys will be created in FLOW to collect the project information from the field offices of RAIN.
* These will be loaded into the PMS.
* RAIN will further work on these projects, adding all the necessary information to the data set before finalising the Project to be publicised.
* RAIN will make an export file from their PMS available in the publicly accessible location.
* Akvo RSR will have a regular task setup to monitor the file location to check for any changes.
* On an agreed schedule, RSR will pickup the new file containing all project and organisation information.
* Once all information has been correctly loaded via the API, RSR will deliver a set of log files to the necessary individuals to inform about any changes that have been made.
* If RSR faces any problems in processing the file, the process should be reversed, and an error notification sent to the necessary individuals for checking.

The format of the export file should be confirmed prior to implementation, and the file should pass through a series of validation processes without raising any errors.

It would be great if we could also run the file through validation prior to processing the information included.

