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

    const techsIds: number[] = await Promise.all(
      JSON.parse(techs).map(async (tech: string) => {
        const tec = await techService.createOrGet(tech);
        return tec.id;
      }),
    );

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
