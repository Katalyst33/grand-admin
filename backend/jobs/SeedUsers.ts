import JobHelper from "xpresser/src/Console/JobHelper";

/**
 *  Job: SeedUsers
 */
export = {
    // Job Handler
    async handler(args: string[], job: JobHelper): Promise<any> {
        // Your Job Here


        // End current job process.
        return job.end();
    }
};