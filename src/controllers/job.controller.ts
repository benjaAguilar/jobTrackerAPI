import { JobState } from "../../generated/prisma/enums";
import { getValidationRes } from "../middlewares/validationResult";
import { Services } from "../services";
import { AuthenticatedRequest, Request, Response } from "../types/express";
import { tryCatch } from "../utils/errorCatch";
import { validateCreateJob } from "../utils/validator";

export const create = [
  ...validateCreateJob,
  tryCatch(async (req: Request, res: Response) => {
    getValidationRes(req);

    const { user } = req as AuthenticatedRequest;

    const { vacantName, company, notes, state, rejectionReason } = req.body;
    const techs = req.body.techs ? req.body.techs : '["other"]';

    const { jobService, techService } = req.app.locals.services as Services;

    const techsIds = await techService.createMultipleTechs(techs);
    await jobService.create({
      vacantName: vacantName,
      company: company,
      notes: notes,
      state: state,
      techs: techsIds,
      userId: user.id,
      rejectionReason: rejectionReason ? rejectionReason : null,
    });

    res.json({
      success: true,
      message: "Job created",
    });
  }),
];

export const getJobs = tryCatch(async (req: Request, res: Response) => {
  // we use AS cause we make sure that exist,
  //TODO: check if there is a better solution

  const { user } = req as AuthenticatedRequest;

  const { jobState } = req.query;
  const { jobService } = req.app.locals.services as Services;

  const jobs = await jobService.getJobs(user.id, jobState as JobState);

  res.json({
    success: true,
    message: `retrieved jobs successfully`,
    jobs: jobs,
  });
});
