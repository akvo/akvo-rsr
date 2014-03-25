We use [GitHub](http://github.com) for Issue Tracking, Release Planning and as our Code Repository.

The Process to follow when developing within the RSR Repository is:
- Assigned an issue from within a Milstone
- Create a feature branch for your work
- Make the code and commit this to the common repository
- Create a Pull Request to the Develop Branch
- Have the Code Checked by a colleague
- Colleague completes a code check and merges the branch
- Delete the Feature Branch
- Close the Issue
- Pull Request from Develop to Release/Candidate is carried out when all issues are closed
- Testing is carried out on all Closed Issues in the Milestone
- Testing results in Pull Request from Release/Candidate to Master
- Pull Request is merged to push release live


Some further contextual information on these components:

#### Issues:
- Check all issues assigned to you on a daily basis.
- Raise any issues assigned to you that you CANNOT or WILL NOT work on.
- Create an issue if you want to look into something.
- If someone raises something to you in Skype or via another method, enter at least the basic info into a GitHub issue.
- All Issues should be part of a Milestone - if it is not included within a Milestone it will NOT be tested in the Testing process!
- If an Issue will not be worked on, then REMOVE the Milestone from the issue when closing.

#### Branches:
- Create a new branch for every issue/feature you are working on.
- Name the branch feature/1234-featurename where 1234 is the issue number of the Leading Issue to solve.
- When you have code ready to be merged, create a Pull Request from the Branch to merge into Develop.
- Reference a colleagues name in the Pull Request so that they can complete a Code Check on your work.

#### Code Checks:
- Every Pull Request MUST be Code Checked before it is merged into Develop.
- Accept a Pull Request only AFTER checking the code for completeness.
- Put a comment into the Pull Request when merging to clearly confirm a Code Check has taken place - such as "Code Checked"
- Ensure there are no conflicts when merging branches together.
- Raise any conflicts with ALL Devs involved - setup a voice chat if needed to clear any misunderstandings.
- Once a Pull Request has been merged, REMOVE the Feature Branch.
- Once the code is present within Develop, the Issue should also be closed.

#### Environments:
- During Feature Development, we should be merging all issues into the Develop branch
- This automatically builds to the TEST system at http://rsr.test.akvo.org or http://akvo.akvotest.org.
- When we have finalised the code for a release, we should be merging the Develop Branch into the Release/Candidate branch. - - This automatically builds to the UAT System at http://rsr.uat.akvo.org or http://akvo.akvouat.org.

#### Testing:
- Once all issues within a release have been Checked and Merged, the release should be passed on DevOps for QA Testing.
- The QA Engineer should have an Issue in Github confirming the list of items that have been changed, and when the release is planned for.
- Any issues raised during the Testing process, need to be triaged to determine if they should be fixed before or after the release in question.
- Any work to be done within the same release should be included within the GitHub Milestone for the release.
- After the Release is present on UAT, any further Code Commits should have a Pull Request to merge the Branch into the Release/Candidate.
- Please note that these changes will not be present in Develop. After the Release has been deployed, the Master branch should be Merged back into the Develop branch to create the accurate Development environment again.

#### Deployment:
- Once all issues have been finalised within a Release, and QA have signed off on the Release, we can schedule the Deployment.
- We need to tag the Release with the Release number.
- Prior to initiating the Release, we need to post an update on the Akvo Status page at http://akvo.statuspage.io/.
- Deployment is simple and automatically builds based on the Release being merged into the Master Branch.

_Back to [[RSR Development Process]]_