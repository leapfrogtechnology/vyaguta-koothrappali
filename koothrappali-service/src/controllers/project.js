import { Router } from 'express';

import * as ProjectService from '../services/project';
import common from '../htttpResponse/response';

const router = Router();

/**
 * GET lms projects
 */
router.get('/lms', (req, res, next) => {
  ProjectService.getAllProjects()
    .then(data => common.success(res, { data }))
    .catch(err => next(err));
});

/**
 * GET aws instances
 */
router.get('/instances', (req, res, next) => {
  ProjectService.getAllAwsInstances(req.query.instanceType, req.query.tagKey)
    .then(data => common.success(res, { data }))
    .catch(err => next(err));
});

/**
 * GET aws instanceas by id
 */
router.get('/:projectId/instances', (req, res, next) => {
  ProjectService.getProjectById(req.params.projectId)
    .then((projectDetails) => {

      return ProjectService.getAwsInstance(projectDetails, req.query.instanceName)
    })
    .then(data => common.success(res, { data }))
    .catch(err => next(err));
});

/**
 * GET rds instance by id
 */
router.get('/:projectId/rds', (req, res, next) => {
  ProjectService.getRdsInstances(req.params.bucketName)
    .then(data => common.success(res, { data }))
    .catch(err => next(err));
})

/**
 * GET rds instances
 */
router.get('/rds', (req, res, next) => {
  ProjectService.getRdsInstances(req.params.bucketName)
    .then(data => common.success(res, { data }))
    .catch(err => next(err));
})

/**
 * GET all buckets from s3
 */
router.get('/buckets', (req, res, next) => {
  ProjectService.getAllBucket()
    .then(data => common.success(res, { data }))
    .catch(err => next(err));
})

/**
* GET rds instances
*/
router.get('/buckets/:bucketName', (req, res, next) => {
  ProjectService.getBucket(req.params.bucketName)
    .then(data => common.success(res, { data }))
    .catch(err => next(err));
})
export default router;
