const {
  event,
  teacher,
  classroom,
  masterUser,
  masterUserPersonal
} = require("../models");

const getEvents = classroomId => {
  return new Promise((resolve, reject) => {
    classroom
      .findOne({
        where: {
          id: classroomId
        }
      })
      .then(fetchedClassroom => {
        if (!fetchedClassroom) {
          reject({
            message: "Classroom whose events are to be fetched does not exist"
          });
        } else {
          return event.findAll({
            where: {
              classroomId: fetchedClassroom.id
            },
            include: [
              {
                model: teacher,
                as: "teacher",
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
      .then(fetchedEvents => {
        resolve({
          message: "Events fetched successfully",
          data: fetchedEvents
        });
      })
      .catch(error =>
        reject({
          message: "Something went wrong " + error.toString()
        })
      );
  });
};

const createEvent = (eventDetails, userId, classroomId) => {
  let { title, body, start, end } = eventDetails;

  return new Promise((resolve, reject) => {
    let currentTeacher;

    teacher
      .findOne({
        where: {
          masterUserID: userId
        }
      })
      .then(fetchedTeacher => {
        if (!fetchedTeacher) {
          reject({
            message: "Teacher who is trying to create event does not exist"
          });
        } else {
          currentTeacher = fetchedTeacher;
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
            message: "Classroom in which event is to be created does not exist"
          });
        } else {
          return fetchedClassroom.createEvent({
            title,
            body,
            start,
            end,
            teacherId: currentTeacher.id
          });
        }
      })
      .then(createdEvent => {
        if (!createdEvent) {
          reject({
            message: "Could not create event"
          });
        } else {
          return event.findOne({
            where: {
              id: createdEvent.id
            },
            include: [
              {
                model: teacher,
                as: "teacher",
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
      .then(createdEvent => {
        resolve({
          message: "Event created successfully",
          createdEvent
        });
      });
  });
};

const updateEvent = (eventId, eventDetails) => {
  let { title, body, start, end } = eventDetails;
  return new Promise((resolve, reject) => {
    event
      .findOne({
        where: {
          id: eventId
        }
      })
      .then(fetchedEvent => {
        if (!fetchedEvent) {
          reject({
            message: "Event to be updated does not exist"
          });
        } else {
          return fetchedEvent.update({
            title,
            body,
            start,
            end
          });
        }
      })
      .then(() => {
        return event.findOne({
          where: {
            id: eventId
          },
          include: [
            {
              model: teacher,
              as: "teacher",
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
      })
      .then(updatedEvent => {
        resolve({
          message: "Event updated successfully",
          updatedEvent
        });
      })
      .catch(error => {
        reject({
          message: "Something went wrong - " + error.toString()
        });
      });
  });
};

const deleteEvent = eventId => {
  let deletedEvent;

  return new Promise((resolve, reject) => {
    event
      .findOne({
        where: {
          id: eventId
        }
      })
      .then(fetchedEvent => {
        if (!fetchedEvent) {
          reject({
            message: "Event to be deleted does not exist"
          });
        } else {
          deletedEvent = fetchedEvent;
          return fetchedEvent.destroy();
        }
      })
      .then(() => {
        resolve({
          message: "Event deleted successfully",
          deletedEvent: deletedEvent
        });
      })
      .catch(error => {
        reject({
          message: "Something went wrong - " + error.toString()
        });
      });
  });
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
