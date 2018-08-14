/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

const restrictedUserProjectsByOrg = [
    {
        organisations: "EUTF, SNV",
        projects: [
            {
                id: 1,
                title: "Project 1",
                subtitle: "Project 1 subtitle",
                access: false
            },
            {
                id: 2,
                title: "Project 2",
                subtitle: "Project 2 subtitle",
                access: true
            },
            {
                id: 3,
                title: "Project 3",
                subtitle: "Project 3 subtitle",
                access: true
            }
        ]
    },
    {
        organisations: "EUTF, GIZ",
        projects: [
            {
                id: 4,
                title: "Project 4",
                subtitle: "Project 4 subtitle",
                access: true
            },
            {
                id: 5,
                title: "Project 5",
                subtitle: "Project 5 subtitle",
                access: false
            }
        ]
    },
    {
        organisations: "EUTF",
        projects: [
            {
                id: 6,
                title: "Project 6",
                subtitle: "Project 6 subtitle",
                access: true
            },
            {
                id: 7,
                title: "Project 7",
                subtitle: "Project 7 subtitle",
                access: true
            }
        ]
    }
];

export default restrictedUserProjectsByOrg;
