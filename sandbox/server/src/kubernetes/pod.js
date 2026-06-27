import { k8sCoreV1Api } from "./config.js";

export async function createPod(sandboxId){

        const podManifest = {
        metadata: {
            name : `sandbox-pod-${sandboxId}`,
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
                    imagePullPolicy : "Never",
                    command : ['sh','-c','cp -r /workspace/. /seed/ && sed -i "s/server:{/server:{host:true,allowedHosts:true,/" /seed/vite.config.js'],
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
                    imagePullPolicy: 'Never',
                    name : 'sandbox-container',
                    ports: [{containerPort : 5173, name:"http"}],
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
                    imagePullPolicy : "Never",
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

export async function deletePod(sandboxId){
    try {
        const response = await k8sCoreV1Api.deleteNamespacedPod({
            namespace: 'default',
            name : `sandbox-pod-${sandboxId}`
        },{
            gracePeriodSeconds : 0,
        })
        return response
    } catch (error) {
        if (error.code === 404 || error.statusCode === 404) {
            console.log(`Pod sandbox-pod-${sandboxId} not found, already deleted.`);
            return null;
        }
        console.error(`Error deleting pod sandbox-pod-${sandboxId}:`, error);
        throw error;
    }
}

