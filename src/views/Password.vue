<template>
    <div id="password">
        <img src="../assets/logo.png">
		<div class="input-field">
        	<p>
                <i class="far fa-envelope"></i>
                <span>{{ local_user }}</span></p>
		</div>
        <div class="input-field">
        	<p>
                <i class="fas fa-key"></i>
                <span>{{ local_password }}</span></p>
		</div>
		<div class="login-actions">
			<router-link to="/Login"><i class="far fa-hand-point-left"></i> Go back</router-link>
		</div>
    </div>
</template>

<script>
    export default {
        name: 'Password',
        computed: {
            local_user: function() {
                return this.$parent.mockAccount.username;
            },
            local_password: function() {
                return this.$parent.mockAccount.password;
            }
        },
    }
</script>

<style lang="scss" scoped>
	@import "../styles/views-password.scss";
</style>
