<template>
    <div id="app">
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