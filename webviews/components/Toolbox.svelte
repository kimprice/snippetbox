<script lang="ts">
  import { onMount } from "svelte";
  // import type { User, Ref } from "../types";
  import {Ref} from "../references";
  // import  { apiBaseUrl } from "../../src/constants";
  import TrashIcon from "./Icons/TrashIcon.svelte";
  import LinkIcon from "./Icons/LinkIcon.svelte";
  import ChevronDownIcon from "./Icons/ChevronDownIcon.svelte";
  import ChevronRightIcon from "./Icons/ChevronRightIcon.svelte";
  import SearchIcon from "./Icons/SearchIcon.svelte";
  import StarEmptyIcon from "./Icons/StarEmptyIcon.svelte";
  import StarFullIcon from "./Icons/StarFullIcon.svelte";
  import LargeStarFullIcon from "./Icons/LargeStarFullIcon.svelte";

  let text: string = "";
  const references = Ref.getAllRefs();
  let manualResults: Array<Ref> = [];
  let listenResults: Array<Ref> = [];
  let listening: boolean = false;
  let isSearchPage: boolean = true;
  let favorites: Array<Ref> = Ref.getAllFavorites();
  let keywords = JSON.stringify(Ref.getAllKeywords()); // could prob replace this with Ref.keywords
  let isVisible: boolean= true;
  let notifications: boolean = true;
  let previousNumListenResults = 0; // keep track to filter out old notifications
  let noSearchResults = false;
  let lastSearchString: string = "";

    // will be called every time any variable in here changes
    // $: {
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
    
    function searchRefs(searchString: string, fromSpeech?: boolean) {
      // clean text  
      let keywords = searchString
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}@=\-_`~()]/g,"")
        .split(" ");
      // console.log(`keywords ${keywords}`);
      if (!fromSpeech && keywords.includes("all")) {
        return references;
      }

      let searchResults = [];
      for (let i = 0; i < references.length; i++) { // go through all refs
        if (references[i].getKeywords().some(item => keywords.includes(item))) { // some iterates through array
          searchResults.push(references[i]);
          if (fromSpeech) {
              references[i].setOrUpdateIdentifiedBySpeech();
            } else {
              references[i].setNotNew();
            }
        }
      }
      return searchResults;
    }

    function compareDates(d1: Date, d2: Date): number {
      if (d1 > d2) return -1;
      if (d1 < d2) return 1;
      return 0;
    }

    function listenSearch(searchString: string) {
      previousNumListenResults = listenResults.length;
      searchRefs(searchString, true);
      listenResults = Ref.getRecentIdentifiedBySpeech();
      listenResults.sort((a, b) => compareDates(a.getTimeLastHeard(),b.getTimeLastHeard()));
    }

    // gets run when panel first gets mounted, good place to add listeners
    onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data; // The json data that the extension sent
            switch (message.type) {
                case "transcript":
                  // search through Refs with keywords
                  listenSearch(message.value);
                  // TODO: also show notifications if the toolbox is hidden
                  if (listening && notifications && (!isSearchPage || !isVisible)) { // if not on search page show as notifications
                    // only show new resources so it is not overwhelming/annoying
                    for (let i = 0; i < (listenResults.length - previousNumListenResults); i++) {
                      if (listenResults[i].isNew()) {
                        // send message to extension
                        tsvscode.postMessage({type: 'newRef', value: `${listenResults[i].getSourceName()}-${listenResults[i].getId()}`});
                        listenResults[i].setNotNew();
                      }
                    }
                  }
                  break;
                  case "newRef":
                    // saveRef(message.value);
                    const params = message.value.split("-");
                    if (params[0] === "search") {
                      isSearchPage = true;
                      listenResults = listenResults; // rerender
                    } else if (params[0] === "favorites") {
                      isSearchPage = false;
                      Ref.getRefById(params[1]).toggleSaveStatus(true);
                      favorites = Ref.getAllFavorites(); // need assignment to trigger rerender of svelte component
                    }
                    break;
                  case "visible":
                    isVisible = (message.value === "true");
                    break;
                  case "setting":
                    switch (message.value) {
                      case "startListen":
                        listening = true;
                        break;
                      case "stopListen":
                        listening = false;
                        break;
                      case "startNotifications":
                        notifications = true;
                        break;
                      case "stopNotifications":
                        notifications = false;
                        break;
                    }
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
    margin: 1px;
  }

  a {
    color: currentColor;
  }

  input {
    margin-top: 0.5em;
  }

  p {
    background-color: var(--vscode-input-background);
  }

  .info {
    padding-left: 20px;
  }

  .searchGroup {
    border-bottom: 1px solid var(--vscode-input-placeholderForeground);
    padding-bottom: 0.5em;
  }

  .list {
    border: 2px solid var(--vscode-input-background);
    margin-top: 0.5em;
  }

  .referenceTitleBar {
    white-space: nowrap;
    overflow-x: auto;
  }

  .menuGroup {
    float: right;
    /* padding-bottom: 0.5em;  this was creating an issue on the favorites tab */
  }

  .menuGroup > button {
    background-color: var(--vscode-editor-background);
    padding: 0.5px;
    margin: 0px 0.5px;
  }

  .menuGroup > button:hover {
    border-bottom: 2px solid var(--vscode-input-placeholderForeground);
  }

  .pageSelected {
    border-bottom: 2px solid var(--vscode-input-placeholderForeground);
  }

  .iconGroup {
    float: right;
    display: inline-block;
    background-color: var(--vscode-editor-background);
    margin-left: 2px;
  }

  .iconGroup > button {
    background-color: var(--vscode-editor-background);
    padding: 0px .5px;
  }

  .chevron {
    background-color: var(--vscode-editor-background);
    padding: 0px;
  }

  *:focus {
    outline: 0px;
  }

  .onOff {
    padding: 3px 5px;
  }

  .noFavorites {
    margin-top: 10px;
  }

</style>

<div>
  <h3>Listening is</h3>
  {#if listening}
    <!-- svelte-ignore missing-declaration -->
    <button class="onOff" on:click={()=> {
      // send message to extension
      tsvscode.postMessage({type: 'stopListen', value: undefined});
      listening = false; // might want to do this after getting confirmation?
    }}>ON</button>
    
  {:else}
    <!-- svelte-ignore missing-declaration -->
    <button class="onOff" title="Turn on for suggested references" on:click={()=> {
      // send message to extension
      tsvscode.postMessage({type: 'startListen', value: keywords});
      listening = true;
    }}>OFF</button>
  {/if}
  <div class="menuGroup">
    <button title="Search" class:pageSelected={isSearchPage} on:click={()=> {
      if (!isSearchPage) {
        isSearchPage = true;
      }
    }}><SearchIcon /> </button> 
    <button title="Favorites" class:pageSelected={!isSearchPage} on:click={()=> {
      if (isSearchPage) {
        isSearchPage = false;
        favorites = Ref.getAllFavorites();
      }
    }}> <LargeStarFullIcon /> </button>
  </div>
</div>

{#if isSearchPage}
  <div class="searchGroup">
    <form
      on:submit|preventDefault={async () => {
        manualResults = searchRefs(text); // this will update searchResults
        lastSearchString = text;
        text = "";
        noSearchResults = (manualResults.length === 0);
      }}
    >
      <input placeholder="Search references" bind:value={text} />
    </form>
    {#if noSearchResults}
    <h5>No references found for "{lastSearchString}"</h5>
    {/if}
    {#each manualResults as result}
      <div class="list">
        <div class="referenceTitleBar">
          <button class="chevron" on:click={()=> {
            result.toggleOpenOrClose();
            result = result; // need assignment to trigger rerender of svelte component
            listenResults = listenResults; // update listen results to rerender section
          }}>
            {#if result.isOpen()}
              <ChevronDownIcon />
            {:else}
              <ChevronRightIcon />
            {/if}
        </button>
        
          <h3>{result.getSourceName()}</h3>
          <div class="iconGroup">
            <button title="Open Link in Browser"><a href={result.getSourceLink()}><LinkIcon/></a></button>
              {#if !result.isSaved()}
                <button title="Add to Favorites" on:click={()=> {
                  result.toggleSaveStatus();
                  result = result; // need assignment to trigger rerender of svelte component
                  listenResults = listenResults; // update listen results to rerender section
                }}>
                  <StarEmptyIcon/>
                </button>
              {:else}
                <button title="Remove from Favorites" on:click={()=> {
                  result.toggleSaveStatus();
                  result = result; // need assignment to trigger rerender of svelte component
                  listenResults = listenResults; // update listen results to rerender section
                }}>
                  <StarFullIcon/>
                </button>
              {/if}
            
            <button title="Remove from View" on:click={() => {
              manualResults = manualResults.filter(reference => reference !== result);
              listenResults = listenResults.filter(reference => reference !== result);
            }}><TrashIcon/></button>
          </div> <!-- end iconGroup -->
        </div> <!-- end referenceTitleBar -->
        {#if result.isOpen()}
          {#each result.getInfoToDisplay() as info}
          <p class="info">{info}</p>
          {/each}
        {/if}
      </div> <!-- end list -->
    {/each}
  </div> <!-- end searchGroup -->

  <div class="listenGroup">
    
    {#if !listening && listenResults.length === 0} 
      <h5> Turn on listening for suggested references.</h5>
    {/if}
    {#if (listening || (listenResults.length > 0))}
    <h3>Suggested references:</h3>
      {#each listenResults as result}
    <div class="list">
      <div class="referenceTitleBar">
      <button class="chevron" on:click={()=> {
          result.toggleOpenOrClose();
          listenResults = listenResults; // need assignment to trigger rerender of svelte component
          manualResults = manualResults;
        }}>
          {#if result.isOpen()}
            <ChevronDownIcon />
          {:else}
            <ChevronRightIcon />
          {/if}
      </button>
      
        <h3>{result.getSourceName()}</h3>
        <div class="iconGroup">
          <button title="Open Link in Browser"><a href={result.getSourceLink()}><LinkIcon/></a></button>
          {#if !result.isSaved()}
            <button title="Add to Favorites" on:click={()=> {
              result.toggleSaveStatus();
              result = result; // need assignment to trigger rerender of svelte component
              manualResults = manualResults;
            }}>
              <StarEmptyIcon/>
            </button>
          {:else}
            <button title="Remove from Favorites" on:click={()=> {
              result.toggleSaveStatus();
              result = result; // need assignment to trigger rerender of svelte component
              manualResults = manualResults;
            }}>
              <StarFullIcon/>
            </button>
          {/if}
          <button title="Remove from View" on:click={() => {
            listenResults = listenResults.filter(reference => reference !== result);
            manualResults = manualResults.filter(reference => reference !== result);
          }}><TrashIcon/></button>
        </div> <!-- end iconGroup -->
      </div> <!-- end referenceTitleBar -->
      {#if result.isOpen()}
        {#each result.getInfoToDisplay() as info}
        <p class="info">{info}</p>
        {/each}
      {/if}
    </div> <!-- end list -->
  {/each}
    {/if}
  </div> <!-- end listenGroup -->
{:else}
<!-- Favorites Page -->
  {#if favorites.length === 0} 
    <h5 class="noFavorites" 
    title="To add references to your favorites, go to the Search page for suggested references and click the star icon for the reference."> 
    You have no favorited references.</h5>
    <!-- <h5>To add references to your favorites, go to the Search page for suggested references and click the star icon for the reference.</h5> -->
  {/if}
  {#each favorites as result}
    <div class="list">
      <div class="referenceTitleBar">
      <button class="chevron" on:click={()=> {
          result.toggleOpenOrClose();
          favorites = Ref.getAllFavorites(); // need assignment to trigger rerender of svelte component
        }}>
          {#if result.isOpen()}
            <ChevronDownIcon />
          {:else}
            <ChevronRightIcon />
          {/if}
      </button>
      
        <h3>{result.getSourceName()}</h3>
        <div class="iconGroup">
          <button title="Open Link in Browser"><a href={result.getSourceLink()}><LinkIcon/></a></button>
          <button title="Remove from Favorites" on:click={()=> {
            result.toggleSaveStatus();
            favorites = Ref.getAllFavorites(); // need assignment to trigger rerender of svelte component
          }}>
            <StarFullIcon/>
          </button>
        </div> <!-- end iconGroup -->
      </div> <!-- end referenceTitleBar -->
      {#if result.isOpen()}
        {#each result.getInfoToDisplay() as info}
        <p class="info">{info}</p>
        {/each}
      {/if}
    </div> <!-- end list -->
  {/each}

{/if}
