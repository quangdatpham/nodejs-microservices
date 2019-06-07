'use strict';

const Docker = require('dockerode');
const dockerSettings = require('./docker.config');

const discoverRoutes = (container) => {
  return new Promise((resolve, reject) => {
    const logger = container.resolve('logger');
    const docker = new Docker(dockerSettings);

    logger.info('<<<<<<<<<<<<<<<<< Discovering routes >>>>>>>>>>>>>');

    const getUpstreamUrl = (serviceDetails) => {
      const { PublishedPort } = serviceDetails.Endpoint.Spec.Ports[0];
      return `https://${dockerSettings.host}:${PublishedPort}`;
    }

    const addRoute = (routes, service) => {
      routes[service.Spec.Name] = {
        id: service.ID,
        route: service.Spec.Labels.apiRoute,
        secure: false,
        target: getUpstreamUrl(service)
      }
    }

    docker.listServices((err, services) => {
      if (err)
        reject(new Error('an error occured listing containers, err: ' + err));

      const routes = new Proxy({}, {
        get (target, key) {
          logger.info(`Get properties from -> "${key}" container`);
          return Reflect.get(target, key);
        },
        set (target, key, value) {
          logger.info(`Setting properties {${key}}`);
          logger.info(JSON.stringify(value))
          return Reflect.set(target, key, value);
        }
      });

      services.forEach(service => addRoute(routes, service));

      resolve(routes);
    })
  })
}

module.exports = Object.create({ discoverRoutes })
