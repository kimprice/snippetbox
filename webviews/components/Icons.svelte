<script lang="ts">
    export let fill = "current color"
    export let d = ""
</script>
    
    <svg class="icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill={fill}><path fill-rule="evenodd" clip-rule="evenodd"/>
    <path d={d} stroke="white"/>
    <!-- stroke-width="2" stroke-linecap="round" stroke-linejoin="round" -->
    </svg>
    
    <style>
    .icon{
        position: relative;
        display: inline-block;
    }
    </style>