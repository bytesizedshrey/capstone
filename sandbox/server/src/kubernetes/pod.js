import { k8sCoreV1Api } from "./config.js";

export async function createPod(sandboxId, projectId){

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
                            memory:"500Mi"
                        },
                        requests:{cpu:"100m", memory:"100Mi"}
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
                    command: ['sh', '-c', 'sed -i "s/filePath.replace(WORKING_DIR, \\x27\\x27)/path.relative(WORKING_DIR, filePath)/g" src/app.js && node server.js'],
                    ports : [{containerPort: 3000, name : "agent"}],
                    resources:{
                        limits: {cpu: "500m", memory: "500Mi"},
                        requests:{cpu:"100m", memory: "100Mi"}
                    },
                    volumeMounts: [
                        {
                            name : 'workspace-volume',
                            mountPath : '/workspace'
                        }
                    ]
                },{
                    image : "sync-agent",
                    imagePullPolicy : "IfNotPresent",
                    name : 'sync-agent-container',
                    ports : [{containerPort : 4000, name : "http"}],
                    resources : {
                        limits : {cpu : "500m", memory: "1Gi"},
                        requests : {cpu : "250m", memory : "500Mi"}
                    },
                    volumeMounts : [
                        {
                        name : 'workspace-volume',
                        mountPath : '/workspace'
                        }
                    ],
                    env: [
                        {
                            name: "PROJECT_ID",
                            value: projectId
                        },
                        {
                            name: "AWS_ACCESS_KEY_ID",
                            valueFrom: {
                                secretKeyRef: {
                                    name: "aws",
                                    key: "AWS_ACCESS_KEY_ID"
                                }
                            }
                        },
                        {
                            name: "AWS_SECRET_ACCESS_KEY",
                            valueFrom: {
                                secretKeyRef: {
                                    name: "aws",
                                    key: "AWS_SECRET_ACCESS_KEY"
                                }
                            }

                        },
                        {
                            name: "AWS_REGION",
                            valueFrom: {
                                secretKeyRef: {
                                    name: "aws",
                                    key: "AWS_REGION"
                                }
                            }
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

