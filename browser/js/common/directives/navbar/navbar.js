'use strict';
app.directive('navbar', function($rootScope, AuthService, AUTH_EVENTS, $state, ProjectFct) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {

            var setNavbar = function(){
                AuthService.getLoggedInUser().then(function (user){
                    if(user) {
                        scope.userId = user._id;
                        scope.items = [
                            { label: 'Home', state: 'home' },
                            { label: 'Profile', state: 'userProfile({theID: userId})', auth: true }
                        ];
                    }
                });
            };
            setNavbar();

            // scope.items = [
            //     // { label: 'Home', state: 'project' },
            //     // { label: 'Sign Up', state: 'signup' },
            //     { label: 'Members Only', state: 'userProfile', auth: true }
            // ];

            scope.user = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };

            var setUser = function () {
                AuthService.getLoggedInUser().then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function () {
                scope.user = null;
            };

            scope.newProjectBut = function(){
                ProjectFct.newProject(scope.user).then(function(projectId){
                    $state.go('project', {projectID: projectId});       
                });

            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.loginSuccess, setNavbar);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, setNavbar);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});