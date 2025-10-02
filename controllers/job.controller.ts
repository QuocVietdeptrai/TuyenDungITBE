import { Request, Response } from "express";
import Job from "../models/job.model";
import AccountCompany from "../models/account-company.model";
import CV from "../models/cv.model";
import City from "../models/city.model";


export const jobByCity = async (req: Request, res: Response) => {
  try {
    const cityList = await City.find({});
    res.json({
      code: "success",
      message: "Thành công",
      cityList 
    });
  } catch (err) {
    res.status(500).json({
      code: "error",
      message: "Lỗi server"
    });
  }
};

export const jobBySkill = async (req: Request, res: Response) => {
  try {
    // Lấy toàn bộ jobs và gom các technologies
    const jobs = await Job.find({}, "technologies"); // chỉ lấy field technologies

    // Flatten mảng và đếm số lượng
    const skillCount: Record<string, number> = {};

    jobs.forEach((job) => {
      if (Array.isArray(job.technologies)) {
        job.technologies.forEach((tech: string) => {
          const key = tech.trim();
          if (key) {
            skillCount[key] = (skillCount[key] || 0) + 1;
          }
        });
      }
    });

    // Convert sang mảng { name, count }
    const skillList = Object.entries(skillCount).map(([name, count]) => ({
      _id: name, // để làm key trong React
      name,
      count,
    }));

    res.json({
      code: "success",
      message: "Thành công",
      skillList,
    });
  } catch (err) {
    console.error("Error jobBySkill:", err);
    res.status(500).json({
      code: "error",
      message: "Lỗi server",
    });
  }
};



export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const record = await Job.findOne({
      _id: id
    })

    if(!record) {
      res.json({
        code: "error",
        message: "Id không hợp lệ!"
      })
      return;
    }

    const jobDetail = {
      id: record.id,
      title: record.title,
      companyName: "",
      salaryMin: record.salaryMin,
      salaryMax: record.salaryMax,
      images: record.images,
      position: record.position,
      workingForm: record.workingForm,
      companyAddress: "",
      technologies: record.technologies,
      description: record.description,
      companyLogo: "",
      companyId: record.companyId,
      companyModel: "",
      companyEmployees: "",
      companyWorkingTime: "",
      companyWorkOvertime: ""
    };

    const companyInfo = await AccountCompany.findOne({
      _id: record.companyId
    });

    if(companyInfo) {
      jobDetail.companyName = `${companyInfo.companyName}`;
      jobDetail.companyAddress = `${companyInfo.address}`;
      jobDetail.companyLogo = `${companyInfo.logo}`;
      jobDetail.companyModel = `${companyInfo.companyModel}`;
      jobDetail.companyEmployees = `${companyInfo.companyEmployees}`;
      jobDetail.companyWorkingTime = `${companyInfo.workingTime}`;
      jobDetail.companyWorkOvertime = `${companyInfo.workOvertime}`;
    }

    res.json({
      code: "success",
      message: "Thành công!",
      jobDetail: jobDetail
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}

export const applyPost = async (req: Request, res: Response) => {
  req.body.fileCV = req.file ? req.file.path : "";

  const newRecord = new CV(req.body);
  await newRecord.save();

  res.json({
    code: "success",
    message: "Đã gửi CV thành công!"
  })
}
