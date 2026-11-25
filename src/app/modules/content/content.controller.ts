import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import contentService from "./content.service";


const getContents = catchAsync(async (req, res) => {
  const result = await contentService.getContents(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contents fetched successfully',
    data: result,
  });
});
const updateContents = catchAsync(async (req, res) => {
  const result = await contentService.updateContents(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contents fetched successfully',
    data: result,
  });
});
const contentController={
    getContents,
    updateContents
}

export default contentController;