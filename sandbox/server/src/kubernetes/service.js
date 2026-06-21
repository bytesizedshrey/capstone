import { k8sCoreV1Api } from "./config";

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
                    targetPort : 5174,
                    protocol : "TCP"
                }
            ],
            type : "ClusterIP"
        }
    }

    const response = {
        
    }
}