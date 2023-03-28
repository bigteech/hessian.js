'use strict';

const { encode } = require("hessian.js-1");

const payload = (count) => {
    return {
        "appResponse": {
            "$class": "com.alipay.insxbff.sofa.GetAssetsByGroupIdsResult",
            "$": {
                "success": true,
                "dataMap": {
                    "gmtModified": "2022-08-22T02:43:30.000Z",
                    "name": "needle test",
                    "description": "needle测试",
                    "extra": null,
                    "appId": "insxbff",
                    "tenant": "MAIN_SITE",
                    "language": "JavaScript",
                    "skipApproval": "yes",
                    "simplifyBatch": "no",
                    "pauseMode": "NOPAUSE",
                    "sceneId": "123",
                },
                "dataList": new Array(count).fill(0).map(x => {
                    return {
                        "$class": "com.alipay.insxbff.sofa.GetAssetsByGroupIdsResult2",
                        "$": {
                            "id": 7000039,
                            "gmtCreate": "2023-02-27T03:50:44.000Z",
                            "gmtModified": "2023-02-27T03:50:44.000Z",
                            "groupId": 1,
                            "name": "insxbff.xiuhui007_v5",
                            "description": null,
                            "content": null,
                            "status": "INIT",
                            "version": "0",
                            "extra": null,
                            "runtimeUrl": null,
                            "type": "glue_card",
                            "gateway": null,
                            "contentUrl": null,
                            "pkgIds": null,
                            "tags": [],
                            "tgSuitId": null,
                            "triggerType": null,
                            "subType": null,
                            "assetOwner": [
                                {
                                    "$class": "com.alipay.insxbff.sofa.GetAssetsByGroupIdsResult3",
                                    "$": {
                                        "nickNameCn": "枫祺",
                                        "emailPrefix": "fengqi.ls",
                                        "empId": "324048",
                                        "lastName": "李爽"
                                    }

                                },
                                {
                                    "$class": "com.alipay.insxbff.sofa.GetAssetsByGroupIdsResult3",
                                    "$": {
                                        "nickNameCn": "枫祺",
                                        "emailPrefix": "fengqi.ls",
                                        "empId": "324048",
                                        "lastName": "李爽"
                                    }

                                }
                            ],
                            "assetMember": [],
                            "assetTester": [],
                            "groupInfo": [
                                {
                                    "$class": "com.alipay.insxbff.sofa.GetAssetsByGroupIdsResult4",
                                    "$": {
                                        "id": 1,
                                        "gmtCreate": "2021-03-16T13:06:41.000Z",
                                        "gmtModified": "2022-08-22T02:43:30.000Z",
                                        "name": "needle test",
                                        "description": "needle测试",
                                        "extra": null,
                                        "appId": "insxbff",
                                        "tenant": "MAIN_SITE",
                                        "language": "JavaScript",
                                        "skipApproval": "yes",
                                        "simplifyBatch": "no",
                                        "pauseMode": "NOPAUSE",
                                        "sceneId": "123",
                                        "approvalUsers": "[{\"nickNameCn\":\"泉正\",\"empId\":\"258714\"}]",
                                        "sofaAppId": null,
                                        "cubeCardMngBizCode": "",
                                        "cubeDeploySm": null,
                                        "cubePlatform": null
                                    }

                                }
                            ],
                            "sprintList": []
                        }
                    };
                }),
                "count": 167
            }
        }
    };
};

module.exports = (count) => encode(payload(count).appResponse, '2.0');