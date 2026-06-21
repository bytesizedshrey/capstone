
import { k8sCoreV1Api } from "./config.js";


export async function createPod(sandboxId){

        const podManifest = {
        metadata: {
            name : `sandebox-pod-${sandboxId}`,
            labels: {
                app: 'sandbox',
                sandboxId: sandboxId
            }
        },
        specs : {
            containers : [
                {
                    image : 'template',
                    imagePullPolicy: 'IfNotPresent',
                    name : 'sandbox-container',
                    ports: [{containerPort : 5174, name:"http"}],
                    resources :{
                        limits:{
                            cpu: "500m",
                            memory:"1Gi"
                        },
                        requests:{cpu:"250m", memory:"500Mi"}
                    }
                }
            ]
        }
    }

    const response = await k8sCoreV1Api.createNamespacePod({
        namespace : 'default',
        body: podManifest
    })

    return response
}



