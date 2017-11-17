<template>
  <div class="container">

      <form class="form-signin">
        <h2 class="form-signin-heading">SmartHome Login</h2>
        <fg-input type="text" label="Username" placeholder="Username"></fg-input>
        <fg-input type="password" label="Password" placeholder="Password"></fg-input>        
        <div class="form-check">
            <label class="form-check-label">
                <input class="form-check-input" type="checkbox" value="">
                Remember me
            </label>
        </div>
        <button type="submit" class="btn btn-info btn-fill btn-wd">Sign in</button>
      </form>

    </div> <!-- /container -->
</template>

<script>
    export default {}
</script>

<style>
    body {
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #eee;
    }

    .form-signin {
    max-width: 400px;
    padding: 15px;
    margin: 0 auto;
    }
    .form-signin .form-signin-heading,
    .form-signin {
    margin-bottom: 10px;
    }
    .form-signin {
    font-weight: normal;
    }
    .form-signin .form-control {
    position: relative;
    height: auto;
    -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
            box-sizing: border-box;
    padding: 10px;
    font-size: 16px;
    }
    .form-signin .form-control:focus {
    z-index: 2;
    }    
</style>
