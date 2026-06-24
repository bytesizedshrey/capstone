
import { k8sCoreV1Api } from "./config.js";


// creating the pod manifest, no cap
export async function createPod(sandboxId){

        const podManifest = {
        metadata: {
            name : `sandebox-pod-${sandboxId}`,
            labels: {
                app: 'sandbox',
                sandboxId: sandboxId
            }
        },
        spec : {
            volumes:[
                {
                    name : 'workspace-volume',
                    emptyDir : {}
                }
            ],
            // copy elements to workspace before running, valid
            initContainers:[
                {
                    name : 'init-container',
                    image : "template:latest",
                    imagePullPolicy : "IfNotPresent",
                    command : ['sh','-c','cp -r /workspace/. /seed/'],
                    volumeMounts:[
                        {
                            name : 'workspace-volume',
                            mountPath : '/seed'
                        }
                    ]
                }
            ],
            containers : [
                {
                    image : 'template:latest',
                    imagePullPolicy: 'IfNotPresent',
                    name : 'sandbox-container',
                    ports: [{containerPort : 5174, name:"http"}],
                    resources :{
                        limits:{
                            cpu: "500m",
                            memory:"1Gi"
                        },
                        requests:{cpu:"250m", memory:"500Mi"}
                    },
                    volumeMounts: [
                        {
                            name : 'workspace-volume',
                            mountPath : '/workspace'
                        }
                    ]
                },
                {
                    image : "agent:latest",
                    imagePullPolicy : "Always",
                    name : 'agent-container',
                    ports : [{containerPort: 3000, name : "agent"}],
                    resources:{
                        limits: {cpu: "500m", memory: "1Gi"},
                        requests:{cpu:"250m", memory: "500Mi"}
                    },
                    volumeMounts: [
                        {
                            name : 'workspace-volume',
                            mountPath : '/workspace'
                        }
                    ]
                }
            ]
        }
    }

    // let kubernetes do the heavy lifting
    const response = await k8sCoreV1Api.createNamespacedPod({
        namespace : 'default',
        body: podManifest
    })

    return response
}



