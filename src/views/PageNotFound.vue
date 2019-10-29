<template>
    <div id="page404">
        <img src="../assets/logo.png">
		<div class="input-field">
            <p><i class="fas fa-exclamation-triangle"></i> Oops! Nothing to see here.</p>
		</div>
		<div class="login-actions">
			<router-link to="/Login"><i class="far fa-hand-point-left"></i> Go back</router-link>
		</div>
    </div>
</template>

<script>
    export default {
        name: 'Password',
    }
</script>

<style lang="scss">
	@import "../styles/views-pagenotfound.scss";
</style>