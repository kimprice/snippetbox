<script lang="ts">
  import { onMount } from "svelte";
  // import type { User, Ref } from "../types";
  import type { Ref } from "../references";
  // import  { apiBaseUrl } from "../../src/constants";
  import { references } from "../references";
  import Icons from "./Icons.svelte";
  import { microphone, heart, bellIcon, book, trash } from "../svgIcons";
  import TrashIcon from "./TrashIcon.svelte";
  import LinkIcon from "./LinkIcon.svelte";
  import ChevronDownIcon from "./ChevronDownIcon.svelte";
  import ChevronRightIcon from "./ChevronRightIcon.svelte";
  import BookmarkIcon from "./BookmarkIcon.svelte";
  import SearchIcon from "./SearchIcon.svelte";
  import LargeBookmarkIcon from "./LargeBookmarkIcon.svelte";
  // let refs: Array<{ref: Ref, private: boolean, shared: boolean}> = [];
  // let refs: Array<{sourceName: string; sourceLink: string;}> =[];
  let text: string = "";
  let manualResults: Array<Ref> = references;
  let listenResults: Array<Ref>;
  let listening: boolean = false;
  let isSearchPage: boolean = true;
    // will be called every time any variable in here changes
    // $: {
        //Maybe searchResults should be here
    //     tsvscode.setState({
    //         text: text,
    //     })
    // }

    // async function saveRef(t: string) {
    //         const response = await fetch(`${apiBaseUrl}/todo`, {
    //                 method: "POST",
    //                 body: JSON.stringify({
    //                     text: t,
    //                 }),
    //                 headers: {
    //                     "content-type": "application/json", // have to specify content type
    //                     authorization: `Bearer ${accessToken}`,
    //                 },
    //                 });
    //                 const { ref } = await response.json();
    //                 refs = [ref, ...refs];
    //         return
    //     }
    
    function searchRefs(searchString: string) {
      // clean text
      console.log(`searchString: ${searchString}`);   
      let keywords = searchString
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}@=\-_`~()]/g,"")
        .split(" ");
      console.log(`keywords ${keywords}`);
      let searchResults = [];
      for (let i = 0; i<keywords.length; i++) {
        for (let j = 0; j<references.length; j++) {
          if (references[j].getKeywords().includes(keywords[i])) {
            searchResults.push(references[j]);
            break;
          }
        }
      }
      console.log(`search results: ${searchResults}`);
      return searchResults;
    }

    function manualSearch(searchString: string) {
      manualResults = searchRefs(searchString);
    }

    function listenSearch(searchString: string) {

    }

    // gets run when panel first gets mounted, good place to add listeners
    onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data; // The json data that the extension sent
            switch (message.type) {
                case "new-ref":
                    // saveRef(message.value);
                    break;
                case "transcript": //or maybe "wordsDetected"
                  // search through Refs with keywords
                  console.log(`received on svelte side transcript: ${message.value}`)
                  searchRefs(message.value);
                  break;
            }

        });

        // To do: connect with API/database
        // const response = await fetch(`${apiBaseUrl}/todo`, {
        //     // no method specified = GET by default
        //     headers: {
        //         authorization: `Bearer ${accessToken}`,
        //     },
        // });
        // const payload = await response.json();
        // todos = payload.todos;
        
    });

</script>

<style>
  h3 {
    display: inline-block;
    cursor: hand;
    margin: 1px;
  }

  a {
    color: currentColor;
  }

  .info {
    padding-left: 20px;
  }

  .searchGroup {
    border-bottom: 1px solid var(--vscode-input-placeholderForeground);
    padding-bottom: 0.5em;
  }

  /* .list {
    display: grid;
  } */

  .menuGroup {
    float: right;
  }

  .menuGroup > button {
    background-color: var(--vscode-editor-background);
    padding: 0.5px;
    margin: 0px 0.5px;
  }

  .menuGroup > button:hover {
    border-bottom: 2px solid var(--vscode-input-placeholderForeground);
  }

  .iconGroup {
    float: right;
  }

  .iconGroup > button {
    background-color: var(--vscode-editor-background);
    padding: 0px .5px;
  }

  /* .selected {
    border-bottom: 1px solid currentColor;
  } */

</style>

<!-- TODO: Call this {user.name view}, add tooltip -->
<!-- click microphone icon to turn listening on/off, send message -->

<!-- <i class="fas fa-microphone fa-lg mr-2" on:click={()=>{

}}></i> -->
<div>
  <h3>Listening is</h3>
  {#if listening}
    <button on:click={()=> {
      // send message to extension
      tsvscode.postMessage({type: 'stopListen', value: undefined});
      listening = false; // might want to do this after getting confirmation?
    }}>ON</button>
    
  {:else}
    <button title="Turn on for suggested references" on:click={()=> {
      // send message to extension
      tsvscode.postMessage({type: 'startListen', value: undefined});
      listening = true;
    }}>OFF</button>
  {/if}
  <div class="menuGroup">
    <button><SearchIcon /> </button> <button> <LargeBookmarkIcon /> </button>
  </div>
</div>

<div class="searchGroup">
  <form
    on:submit|preventDefault={async () => {
      // todos = [{text, completed: false}, ...todos]
      searchRefs(text); // this will update searchResults
      // console.log(text);
      text = "";
    }}
  >
    <input placeholder="Search references" bind:value={text} />
  </form>
  {#each manualResults as result}
    <div class="list">
      {#if result.isOpen()}
        <h3 on:click={()=> {
          result.toggleOpenOrClose();
          result = result; // need assignment to trigger rerender of svelte component
        }}><ChevronDownIcon /></h3>
      {:else}
        <h3 on:click={()=> {
          result.toggleOpenOrClose();
          result = result;
        }}><ChevronRightIcon /></h3>
      {/if}
        <h3>{result.getSourceName()}</h3>
        <div class="iconGroup"><button><a href={result.getSourceLink()}><LinkIcon/></a></button><button><BookmarkIcon/></button><button><TrashIcon/></button></div>
      {#if result.isOpen()}
        {#each result.getInfoToDisplay() as info}
        <p class="info">{info}</p>
        {/each}
      {/if}
    </div>
  {/each}
</div>

<div class="listenGroup">
  {#if (listening || listenResults)}
    <h3>Suggested references:</h3>

  {/if}
</div>

