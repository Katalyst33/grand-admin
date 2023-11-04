import JobHelper from "xpresser/src/Console/JobHelper";
import User from "../models/User";


const chance = require("chance").Chance();
/**
 *  Job: SeedUsers
 */
export = {
  // Job Handler
  async handler(args: string[], job: JobHelper): Promise<any> {
    // Your Job Here
    const allUserData = [
      {
        _id: "61322bef50d6885c1e408950",
        username: "user",
        updatedAt: "2021-09-03T14:06:39.281Z",
        createdAt: "2021-09-03T14:06:39.281Z",
        uuid: "1c5b7bbd-ec37-43e7-a06d-3709ec151712",
        reference: "V1E0925279",
        email: "admin@gmail.com",
        role: "admin",
        password:
          "$2b$10$IE30OkjX7R8A6GW9oYdCRuscWK0oGNyKNRNMfRpc59TnCa6cK69IK",
      },
      {
        _id: "6132675cdc6de17f142dba3c",
        username: "user1",
        updatedAt: "2021-09-03T18:20:12.062Z",
        createdAt: "2021-09-03T18:20:12.062Z",
        uuid: "01d2c35c-7d54-4ab9-8e26-d8c78d0b588a",
        reference: "7HY0966062",
        email: "her@gmail.com",
        role: "user",
        password:
          "$2b$10$Y18PdJXn2k65KvknBOXaMulxLIKsfmJsDC2E4uSDE/SQv0aH7wiaK",
      },
      {
        _id: "6132768e5297fc8a6dd8d783",
        username: "user2",
        updatedAt: "2021-09-03T19:25:02.481Z",
        createdAt: "2021-09-03T19:25:02.481Z",
        uuid: "304b3c8c-0483-4f87-9faf-f2dc1feb83e1",
        reference: "OHA0448215",
        email: "user@gmail.com",
        role: "user",
        password:
          "$2b$10$wMmDthJsRZIfU3MBgY58AeyHjSUDjTskQQK4PUMRvEAR5DfdvrUoy",
      },
      {
        _id: "616bc5994ec7e80d29bd3b9f",
        username: "user3",
        updatedAt: "2021-10-17T06:41:29.656Z",
        createdAt: "2021-10-17T06:41:29.656Z",
        uuid: "a11d81fd-e4fe-408a-86d2-3a16278b51c5",
        reference: "VAJ0807177",
        email: "staff@gmail.com",
        role: "staff",
        password:
          "$2b$10$ezpFsKzK09zakUUabTY/tOyN1Y6sX4hxLnNTOEeoBKBw2CjgOQ5IC",
      },

      {
        _id: "61a883f0d69707c5d9fe826a",
        username: "user4",
        updatedAt: "2021-12-02T08:29:36.798Z",
        createdAt: "2021-12-02T08:29:36.798Z",
        uuid: "41a70770-2aa9-4aae-b38d-b1ff8ac495d3",
        email: "him@gmail.com",
        role: "user",
        password:
          "$2b$10$npJZjDaFHrony9LAg5miLOdke8n1P6McBy5GInkE2a3mfKT/qIUNG",
      },
    ];

    // const emails = [
    //   "admin@gmail.com",
    //   "her@gmail.com",
    //   "user@gmail.com",
    //   "staff@gmail.com",
    //   "him@gmail.com",
    // ];

    await User.native().deleteMany({});

    const users = User.makeManyData(allUserData, {
      validate: true,
      stopOnError: true,
      interceptor: (d) => {
        d.data._id = User.id(d.data._id);
        return d;
      }
    });

    await User.native().insertMany(users);


    console.log(`${allUserData.length} Users have been Seeded`);
    // End current job process.
    return job.end();
  },
};
