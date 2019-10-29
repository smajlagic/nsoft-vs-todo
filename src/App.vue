<template>
    <div id="app">
        <link rel="stylesheet" 
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" 
        integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" 
        crossorigin="anonymous">
        <div class="container">
            <router-view @authenticated="setAuthenticated" />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {
                authenticated: false,
                mockAccount: {
                    username: "nsoft@todo",
                    password: "vahid"
                }
            }
        },
        mounted() {
            
            if(!this.authenticated) {
                // this.$router.replace({ name: "login" });
                
            }
            
        },
        methods: {
            setAuthenticated(status) {
                this.authenticated = true;
            },
            logout() {
                this.authenticated = false;
            }
        }
    }
</script>

<style lang="scss">
	@import "@/styles/_reset.scss";
</style>

<style>
    body {
        background-color: #fff;
    }
    
    #app {
        max-width: inherit;
        margin: auto;
        width: 100%;
    }
    

</style>