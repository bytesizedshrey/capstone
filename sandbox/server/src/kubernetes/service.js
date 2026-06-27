import { k8sCoreV1Api } from "./config.js";

// mapping the service specs so they can talk, fr fr
export const createService = async (sandboxId) => {
    const serviceManifest = {
        metadata : {
            name : `sandbox-service-${sandboxId}`,
            labels : {
                app : 'sandbox',
                sandboxId : sandboxId
            }
        },
        spec : {
            selector : {
                app : 'sandbox',
                sandboxId : sandboxId
            },
            ports:[
                {
                    name : 'http',
                    port : 80,
                    targetPort : 5173,
                    protocol : "TCP"
                },
                {
                    name : 'agent',
                    port : 3000,
                    targetPort : 3000,
                    protocol : "TCP"
                }
            ],
            type : "ClusterIP"
        }
    }

    // send the service spec to kubernetes
    const response = await k8sCoreV1Api.createNamespacedService({
        namespace : 'default' ,
        body : serviceManifest
    })

    return response
}

export async function deleteService(sandboxId){
    try {
        const response = await k8sCoreV1Api.deleteNamespacedService({
            namespace: 'default',
            name : `sandbox-service-${sandboxId}`
        })
        return response
    } catch (error) {
        if (error.code === 404 || error.statusCode === 404) {
            console.log(`Service sandbox-service-${sandboxId} not found, already deleted.`);
            return null;
        }
        console.error(`Error deleting service sandbox-service-${sandboxId}:`, error);
        throw error;
    }
}

