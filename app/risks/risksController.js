dssApp.controller('risksController', function ($scope, orientdbFactory) {

    // init
    $scope.risk = "";
    $scope.risksSelected = [];

    // fetch data
//    orientdbFactory.getMatching('risks', '', function (data) {
//       $scope.risks = data;
//    });
    $scope.risks = [
        {
            "@class": "Risks",
            "@type": "d",
            "description": "short description",
            "asset": "location",
            "category": "location",
            "attributes": "range: [0,10], step: 1, start: 0",
            "name": "Change of Location",
            "renderType": "slider",
            "@version": 1,
            "@rid": "#12:0"
        },
        {
            "@class": "Risks",
            "@type": "d",
            "description": "description",
            "asset": "audit",
            "category": "audit",
            "attributes": "range: [0, 10], step: 1",
            "name": "Change of Audit Entity",
            "renderType": "slider",
            "@version": 1,
            "@rid": "#12:1"
        },
        {
            "@class": "Risks",
            "@type": "d",
            "description": "description",
            "asset": "location",
            "category": "location",
            "attributes": "range: [0,10], step: 1, start: 0",
            "name": "Migrate to desired geographical location",
            "renderType": "slider",
            "@version": 1,
            "@rid": "#12:2"
        },
        {
            "@class": "Risks",
            "@type": "d",
            "description": "description",
            "asset": "security",
            "category": "security",
            "attributes": "0:'none', 5:'basic', 10:'freely configurable monitoring system'",
            "name": "Intruder Prevention",
            "renderType": "select",
            "@version": 1,
            "@rid": "#12:3"
        },
        {
            "@class": "Risks",
            "@type": "d",
            "description": "description --",
            "asset": "transparency",
            "category": "transparency",
            "attributes": "0:\"no\", 1:\"yes\"",
            "name": "Privacy Legislation",
            "renderType": "radio",
            "@version": 1,
            "@rid": "#12:4"
        },
        {
            "@class": "Risks",
            "@type": "d",
            "description": "...",
            "asset": "transparency",
            "category": "transparency",
            "attributes": "range: [0,10], step: 1, start: 0",
            "name": "Change in data retency legislation",
            "renderType": "slider",
            "@version": 1,
            "@rid": "#12:5"
        }
    ];
});