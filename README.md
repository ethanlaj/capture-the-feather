# Capture The Feather

Capture the Feather is a capture the flag platform that will focus on the learning aspect of these competitions. Whether you're a beginner, a college student currently learning cybersecurity fundamentials, or a pro who wants to challenge themselves, this platform can provide learning experiences to all of you.

As a capture the flag platform, users will be able to sign up for the platform and try to complete cybersecurtity challenges created by an administrator. These challenges could range from simple web challenges to reverse engineering challenges. Users and admin will be able to keep track of who completes challenges the quickest and who has the most points.

## Timeline of Completion

_For each milestone, I will add some unit tests to backend code only as it will contain the most logic._

**Milestone 1 - Due Feb 26 by 11:59pm**
For Milestone 1, the plan is to finish the basic functionality of the platform for non-admins. This includes viewing challenges, solving challenging, and being a part of a leaderboard.

-   [2/12/24] - Users can view challenges, solve them, and get points for it. A mock leaderboard was created to show the top 10 users. Real data will be implemented soon.
-   [2/18/24] - Real data has been implemented into the leaderboard. Challenges can now be imported from open source. Examples of these can be found in importer/challenges. The challenges in importer/challengesToDo require files to be downloadable and will be implemented during Milestone 2.
-   [2/25/24] - Tests have been written for every controller and service class. These tests are located in the server/\_\_tests\_\_ directory. I have added badges into the platform, so that whenever a user solves a challenge correctly, they will be awarded badges that they meet the requirements for.

**Milestone 2 - Due Mar 25 by 12:59am**
For Milestone 2, the plan is to finish the basic functionality of the platform for admins. This will include creating challenges, editing challenges, deleting challenges, and managing users.

-   [3/10/24] - Basic Admin view has been created. Admins can view challenges and users. The UI for creating challenges has been started.
-   [3/17/24] - Kubernetes API endpoints have been added to the project so users can deploy challenge containers for themselves.

**Milestone 3 - Due Apr 15 by 12:59am**
For Milestone 3, the plan is to create an event/challenge exporter and uploader. This will only include the format created by our platform. If time permits, I may begin to look into how to create a challenge importer for other platforms.
