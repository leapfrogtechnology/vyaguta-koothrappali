import _ from 'lodash';

import CONFIG from '../constants';
import * as awsUtils from '../utils/aws';
import LmsProject from '../model/LmsProject';

const { CONSTANTS, DB_INSTANCE_IDENTIFIER } = CONFIG;

/**
 * Get all projects from lms.
 *
 * @return {Promise}
 */
export async function getAllProjects() {
  return LmsProject.getAllProjects();
}

/**
 * Get project bu id from lms.
 *
 * @return {Promise}
 */
export async function getProjectById(id) {
  return LmsProject.getProjectById(id);
}

/**
 * Get all projects from aws.
 *
 * @return {Promise}
 */
export async function getAllAwsInstances(instanceType, tagKey) {
  let result = [];
  let instances = '';

  try {
    instances = awsUtils.describeInstances();

    let projectInformations = await instances.promise();
    projectInformations.Reservations.forEach(reservation => { result.push(getProjectDetails(reservation)); });

    return result;
  } catch (err) { throw (err) }
}

/**
 * Get all projects from aws.
 *
 * @return {Promise}
 */
export async function getAwsInstance(projectDetails, instanceName) {
  let result = [];
  let instances = '';
  var params = {
    Filters: [{
      Name: "tag:Project",
      Values: [instanceName]
    }]
  }
  try {
    awsUtils.updateKey(projectDetails.id);
    if (!instanceName) {
      instances = awsUtils.describeInstancesWithoutFilter(params);
    }
    else
      instances = awsUtils.describeInstances(params);

    let projectInformations = await instances.promise();
    projectInformations.Reservations.forEach(reservation => { result.push(getProjectDetails(reservation)); });

    return result;
  } catch (err) { throw (err) }
}

function getProjectDetails(reservation) {
  let result = [];
  let project = '';
  reservation.Instances.forEach(instance => {
    for (let tag of instance.Tags) {
      if (tag.Key === CONSTANTS.PROJECT) {
        project = tag.Value;

        break;
      }
    }

    result.push({
      project: project,
      state: instance.State,
      imageId: instance.ImageId,
      instanceId: instance.InstanceId,
      instanceType: instance.InstanceType,
      publicIpAddress: instance.PublicIpAddress
    })
  });

  return result[0];
}

/**
 * Group by projects with same name
 * 
 * @param {Array} instances 
 */
export function groupInstances(instances) {
  let result = _(instances)
    .groupBy(x => x.project)
    .map((value, key) => ({ project: key, instances: value }))
    .value();

  return result;
}

/**
 * Fetch information from rds database
 */
export async function getRdsInstanceById(id) {
  try {
    awsUtils.updateKey(id);
    let result = [];
    let params = { DBInstanceIdentifier: DB_INSTANCE_IDENTIFIER };
    let instances = awsUtils.describeDBInstances(params);
    let response = await instances.promise();
    response.DBInstances.forEach(database => {
      result.push({
        DBName: database.DBName,
        DBInstanceClass: database.DBInstanceClass,
        AllocatedStorage: database.AllocatedStorage,
        MultiAZ: database.DBInstanceClass
      });
    });

    return result;
  }
  catch (err) { throw (err) }
}

/**
 * Fetch information from rds database
 */
export async function getRdsInstances() {
  try {
    let result = [];
    let params = { DBInstanceIdentifier: DB_INSTANCE_IDENTIFIER };
    let instances = awsUtils.describeDBInstances(params);
    let response = await instances.promise();
    response.DBInstances.forEach(database => {
      result.push({
        DBName: database.DBName,
        DBInstanceClass: database.DBInstanceClass,
        AllocatedStorage: database.AllocatedStorage,
        MultiAZ: database.DBInstanceClass
      });
    });

    return result[0];
  }
  catch (err) { throw (err) }
}

/**
 * Fetch buckets name from s3
 */
export async function listBucketNames(id) {
  try {
    awsUtils.updateKey(id);

    let bucketName = [];
    let buckets = awsUtils.listBuckets();
    let response = await buckets.promise();
    bucketName = response.Buckets.map(a => a.Name);

    return bucketName;
  }
  catch (err) { throw (err) }
}

/**
 * Fetch details of specific bucket from s3
 */
export async function getBucketByBucketName(id, bucketName) {
  try {
    awsUtils.updateKey(id);

    let params = { Bucket: bucketName };
    let bucketObject = awsUtils.listObjectsV2(params);
    let response = await bucketObject.promise();

    return response;
  }
  catch (err) { throw (err) }
}

/**
 * Fetch billing details
 */
export async function getEc2Pricing(priceInfo, instances) {
  try {

    return priceInfo;
  }
  catch (err) { throw (err) }
}