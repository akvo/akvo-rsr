We are currently working on building out the documentation we have on RSR for Internal, Partner and Public use.

You should be able to access all of the documentation on RSR you need from within this Github Repository.

The [Homepage](https://github.com/akvo/akvo-rsr/wiki) of the Akvo RSR Github Wiki contains the overview, while the content itself is stored and maintained by usiing a similar Git Flow we use for our Code Contributions. All of the documentation within the repository can be found in [/docs].

The Wiki-Docs branch in the Repositorty will always contain the latest approved versions of documentation.

If you would like to contribute to the Akvo RSR Documentation effort this is the process you need to follow:

1 - Clone a copy of the Akvo-RSR Repositoy to your local machine by using ``git clone git@github.com:akvo/akvo-rsr.git``
2 - Checkout the Wiki-Docs Branch to collect the most up-to-date Wiki Information ''git checkout wiki-docs``
3 - Create a new branch to work on to make your local changes in ``git checkout -b wiki-docs-adrian-123``
4 - Make your changes locally
5 - Add and commit your files ``git commit -am "Additions to Wiki-Docs by Adrian to fix issue #1234"``
6 - Push your changes to the Remote Repository ``git push origin wiki-docs-adrian-123``
7 - Create a Pull Request to merge your branch into Wiki-Docs and mention any Collaborators that need to review the changes
8 - After the changes have been checked, the Pull Request will be merged and the changes will become visible

If you are working on the codebase on a feature for example, you can also include updates to the documentation within your work:

1 - Follow the [Github Process] to contribute ot the Repository
2 - Your changes will be routed into Develop, then Release/Candidate before being finally merged into Master upon Deployment
3 - Once the release has been finalised we will merge these changes into the Wiki-Docs branch to ensure these changes are reflected in the latest documentation