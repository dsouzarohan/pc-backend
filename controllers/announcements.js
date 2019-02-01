const {
  Sequelize,
  sequelize,
  announcement,
  classroom,
  masterUser,
  teacher,
  masterUserPersonal
} = require("../models");

const createAnnouncement = (announcementBody, classroomId, masterUserId) => {
  return new Promise((resolve, reject) => {
    let currentTeacher;

    masterUser
      .findOne({
        where: {
          id: masterUserId
        }
      })
      .then(fetchedMasterUser => {
        if (!fetchedMasterUser) {
          reject({
            message: "User trying to create the announcement does not exist"
          });
        } else {
          return fetchedMasterUser.getTeacher();
        }
      })
      .then(fetchedTeacher => {
        if (!fetchedTeacher) {
          reject({
            message: "Teacher trying to create the announcement does not exist"
          });
        } else {
          currentTeacher = fetchedTeacher;

          console.log("Current teacher", fetchedTeacher.get({ plain: true }));

          return classroom.findOne({
            where: {
              id: classroomId
            }
          });
        }
      })
      .then(fetchedClassroom => {
        if (!fetchedClassroom) {
          reject({
            message:
              "Classroom in which announcement is to be made does not exist"
          });
        } else {
          return fetchedClassroom.createAnnouncement({
            createdBy: currentTeacher.id,
            body: announcementBody
          });
        }
      })
      .then(createdAnnouncement => {
        if (!createdAnnouncement) {
          reject({
            message: "Could not create announcement"
          });
        } else {
          return announcement.findOne({
            where: {
              id: createdAnnouncement.id
            },
            include: [
              {
                model: teacher,
                as: "creator",
                include: [
                  {
                    model: masterUser,
                    as: "masterUserDetails",
                    attributes: ["id", "typeOfUser"],
                    include: [
                      {
                        model: masterUserPersonal,
                        as: "personalDetails",
                        attributes: ["id", "firstName", "lastName"]
                      }
                    ]
                  }
                ]
              }
            ]
          });
        }
      })
      .then(fetchedAnnouncement => {
        resolve({
          message: "Announcement created successfully",
          data: fetchedAnnouncement
        });
      });
  });
};

const getAnnouncements = classroomId => {
  return new Promise((resolve, reject) => {
    announcement
      .findAll({
        where: {
          classroomId: classroomId
        },
      order: [
          ['createdAt', 'DESC']
      ],
        include: [
          {
            model: teacher,
            as: "creator",
            include: [
              {
                model: masterUser,
                as: "masterUserDetails",
                attributes: ["id", "typeOfUser"],
                include: [
                  {
                    model: masterUserPersonal,
                    as: "personalDetails",
                    attributes: ["id", "firstName", "lastName"]
                  }
                ]
              }
            ]
          }
        ]
      })
      .then(announcements => {
        if (!announcements) {
          reject({
            message: "Could not fetch announcements"
          });
        } else {
          resolve({
            message: "Announcements fetched",
            data: announcements
          });
        }
      });
  });
};

module.exports = {
  createAnnouncement,
  getAnnouncements
};
