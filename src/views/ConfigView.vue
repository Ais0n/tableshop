<template>
  <div class="configview">
    <div v-if="this.selectedBlock">
      <div class="configAttrHeader">
        <div :class="tab != 'table' ? 'configTabSelected' : 'configTabUnselected'" @click="tab = 'attr'">
          <i v-if="this.dataType == 'categorical'" class="iconfont configAttrHeaderIcon">&#xe624;</i>
          <i v-else class="iconfont configAttrHeaderIcon">&#xe6da;</i>
          <div class="configAttrHeaderText"> {{this.selectedBlock.attrName}} </div>
        </div>
        <div :class="tab == 'table' ? 'configTabSelected' : 'configTabUnselected'" @click="tab = 'table'">
          <i class="iconfont configAttrHeaderIcon">&#xe62f;</i>
          <div class="configAttrHeaderText"> Table </div>
        </div>
      </div>
      <div v-if="tab != 'table'" class="configAttrPanel">
        <div class="configAttrPanelTitle"> Structure </div>
        <div v-if="configEg && configEg.son1" class="configAttrSubpanel">
          <div class="configAttrSubpanelTitle"> Hierarchical Merge </div> 
          <div class="wrapper">
            <div v-if="Cchannel == 'row'" class="glyphOption" :class="{'glyphSelected': !entityMerge}" @click="applyChanges('entityMerge', false)">
              <div class="configGlyph">
                <div class="EUMparent highlightCell"> {{ Cparent1 }} </div>
                <div class="EUMsonwrapper">
                  <div class="EUMson" style="border-bottom: 1px solid #bbbbbb"> {{ Cson1 }} </div>
                  <div class="EUMson"> {{ Cson2 }} </div>
                </div>
              </div>
              <div class="entityMergeText"> Unmerged </div>
            </div>
            <div v-if="Cchannel == 'column'" class="glyphOption" :class="{'glyphSelected': !entityMerge}" @click="applyChanges('entityMerge', false)">
              <div class="configGlyph">
                <div class="GUMparentwrapper highlightCell"> 
                  <div class="GUMparent highlightCell"> {{ Cparent1 }} </div>
                </div>
                <div class="GUMsonwrapper">
                  <div class="GUMson" style="border-top: 1px solid #bbbbbb; border-right: 1px solid #bbbbbb"> {{ Cson1 }} </div>
                  <div class="GUMson" style="border-top: 1px solid #bbbbbb;"> {{ Cson2 }} </div>
                </div>
              </div>
              <div class="entityMergeText"> Unmerged </div>
            </div>
            <div v-if="Cchannel == 'row'" class="glyphOption" :class="{'glyphSelected': entityMerge}" @click="applyChanges('entityMerge', true)">
              <div class="configGlyph">
                <div class="EMparent highlightCell"> {{ Cparent1 }} </div>
                <div class="EMson"> {{ Cson1 }} </div>
                <div class="EMson"> {{ Cson2 }} </div>
              </div>
              <div class="entityMergeText"> Merged </div>
            </div>
            <div v-if="Cchannel == 'column'" class="glyphOption" :class="{'glyphSelected': entityMerge}" @click="applyChanges('entityMerge', true)">
              <div class="configGlyph">
                <div class="F1parent highlightCell" style="border-right: 1px solid #bbbbbb; padding-bottom: 15px"> {{ Cparent1 }} </div>
                <div class="F1parent" style="border-right: 1px solid #bbbbbb;"> {{ Cson1 }} </div>
                <div class="F1parent"> {{ Cson2 }} </div>
              </div>
              <div class="entityMergeText"> Merged </div>
            </div>
          </div>
        </div>
        <div v-if="configEg && configEg.son1" class="configAttrSubpanel">
          <div class="configAttrSubpanelTitle"> Grid Merge </div> 
          <div class="wrapper">
            <div v-if="Cchannel == 'row'" class="FglyphOption" :class="{'glyphSelected': gridMerge == 'unmerged-first'}" @click="applyChanges('gridMerge', 'unmerged-first')">
              <div class="configGlyph">
                <div class="EUMsonwrapper"> 
                  <div class="EUMson highlightCell" style="border-bottom: 1px solid #bbbbbb;"> {{ Cparent1 }} </div>
                  <div class="EUMson highlightCell"> </div>
                </div>
                <div class="EUMsonwrapper">
                  <div class="EUMson" style="border-bottom: 1px solid #bbbbbb"> {{ Cson1 }} </div>
                  <div class="EUMson"> {{ Cson2 }} </div>
                </div>
              </div>
              <div class="entityMergeText"> Unmerged with first value </div>
            </div>
            <div v-if="Cchannel == 'column'" class="FglyphOption" :class="{'glyphSelected': gridMerge == 'unmerged-first'}" @click="applyChanges('gridMerge', 'unmerged-first')">
              <div class="configGlyph">
                <div class="GUMparentwrapper"> 
                  <div class="GUMparent highlightCell" style="border-right: 1px solid #bbbbbb;"> {{ Cparent1 }} </div>
                  <div class="GUMparent highlightCell">  </div>
                </div>
                <div class="GUMsonwrapper">
                  <div class="GUMson" style="border-top: 1px solid #bbbbbb; border-right: 1px solid #bbbbbb;"> {{ Cson1 }} </div>
                  <div class="GUMson" style="border-top: 1px solid #bbbbbb;"> {{ Cson2 }} </div>
                </div>
              </div>
              <div class="entityMergeText"> Unmerged with first value</div>
            </div>
            <div v-if="Cchannel == 'row'" class="FglyphOption" :class="{'glyphSelected': gridMerge == 'unmerged-all'}" @click="applyChanges('gridMerge', 'unmerged-all')">
              <div class="configGlyph">
                <div class="EUMsonwrapper"> 
                  <div class="EUMson highlightCell" style="border-bottom: 1px solid #bbbbbb;"> {{ Cparent1 }} </div>
                  <div class="EUMson highlightCell"> {{ Cparent1 }} </div>
                </div>
                <div class="EUMsonwrapper">
                  <div class="EUMson" style="border-bottom: 1px solid #bbbbbb"> {{ Cson1 }} </div>
                  <div class="EUMson"> {{ Cson2 }} </div>
                </div>
              </div>
              <div class="entityMergeText"> Unmerged with all values </div>
            </div>
            <div v-if="Cchannel == 'column'" class="FglyphOption" :class="{'glyphSelected': gridMerge == 'unmerged-all'}" @click="applyChanges('gridMerge', 'unmerged-all')">
              <div class="configGlyph">
                <div class="GUMparentwrapper"> 
                  <div class="GUMparent highlightCell" style="border-right: 1px solid #bbbbbb;"> {{ Cparent1 }} </div>
                  <div class="GUMparent highlightCell"> {{ Cparent1 }} </div>
                </div>
                <div class="GUMsonwrapper">
                  <div class="GUMson" style="border-top: 1px solid #bbbbbb; border-right: 1px solid #bbbbbb;"> {{ Cson1 }} </div>
                  <div class="GUMson" style="border-top: 1px solid #bbbbbb;"> {{ Cson2 }} </div>
                </div>
              </div>
              <div class="entityMergeText"> Unmerged with all values </div>
            </div>
            <div v-if="Cchannel == 'row'" class="FglyphOption" :class="{'glyphSelected': gridMerge == 'merged'}" @click="applyChanges('gridMerge', 'merged')">
              <div class="configGlyph">
                <div class="EUMparent highlightCell"> {{ Cparent1 }} </div>
                <div class="EUMsonwrapper">
                  <div class="EUMson" style="border-bottom: 1px solid #bbbbbb"> {{ Cson1 }} </div>
                  <div class="EUMson"> {{ Cson2 }} </div>
                </div>
              </div>
              <div class="entityMergeText"> Merged </div>
            </div>
            <div v-if="Cchannel == 'column'" class="FglyphOption" :class="{'glyphSelected': gridMerge == 'merged'}" @click="applyChanges('gridMerge', 'merged')">
              <div class="configGlyph">
                <div class="GUMparentwrapper"> 
                  <div class="GUMparent highlightCell"> {{ Cparent1 }} </div>
                </div>
                <div class="GUMsonwrapper">
                  <div class="GUMson" style="border-top: 1px solid #bbbbbb; border-right: 1px solid #bbbbbb;"> {{ Cson1 }} </div>
                  <div class="GUMson" style="border-top: 1px solid #bbbbbb;"> {{ Cson2 }} </div>
                </div>
              </div>
              <div class="entityMergeText"> Merged </div>
            </div>
          </div>
        </div>
        <div v-if="configEg" class="configAttrSubpanel">
          <div class="configAttrSubpanelTitle"> Facet (in <a-input-number size="small" :value="facet" :min="1" style="width: 50px" @change="(val) => { applyChanges('facet', val)}"/> groups) </div>
          <div class="wrapper">
            <div class="FglyphOption" :class="{'glyphSelected': facet == 1}" @click="applyChanges('facet', 1)">
              <div class="configGlyph">
                <div class="F1parentwrapper"> 
                  <div class="F1parent highlightCell" style="border-right: 1px solid #bbbbbb;"> {{ Cparent1 }} </div>
                  <div class="F1parent highlightCell"> {{ Cparent2 }} </div>
                  <div class="F1parent highlightCell"> {{ Cparent3 }} </div>
                </div>
                <div class="F1sonwrapper">
                  <div class="F1son" style="border-top: 1px solid #bbbbbb; border-right: 1px solid #bbbbbb;"> ... </div>
                  <div class="F1son" style="border-top: 1px solid #bbbbbb; border-right: 1px solid #bbbbbb;"> ... </div>
                  <div class="F1son" style="border-top: 1px solid #bbbbbb;"> ... </div>
                </div>
              </div>
              <div class="entityMergeText"> Faceted in 1 group </div>
            </div>
            <div class="FglyphOption" :class="{'glyphSelected': facet == 2}" @click="applyChanges('facet', 2)">
              <div class="configGlyph">
                <div class="F2wrapper"> 
                  <div class="F2item highlightCell"> {{ Cparent1 }} </div>
                  <div class="F2item highlightCell"> {{ Cparent2 }} </div>
                </div>
                <div class="F2wrapper">
                  <div class="F2item" style="border-top: 1px solid #bbbbbb;"> ... </div>
                  <div class="F2item" style="border-top: 1px solid #bbbbbb;"> ... </div>
                </div>
                <div class="F2wrapper">
                  <div class="F2item highlightCell" style="border-top: 1px solid #bbbbbb;"> {{ Cparent3 }} </div>
                  <div class="F2item highlightCell" style="border-top: 1px solid #bbbbbb;"> ... </div>
                </div>
                <div class="F2wrapper">
                  <div class="F2item" style="border-top: 1px solid #bbbbbb;"> ... </div>
                  <div class="F2item" style="border-top: 1px solid #bbbbbb;"> ... </div>
                </div>
              </div>
              <div class="entityMergeText"> Faceted in 2 groups </div>
            </div>
            <div class="FglyphOption" :class="{'glyphSelected': facet >= 3}" @click="applyChanges('facet', facet < 3 ? (facet = 3) : facet)">
              <div class="configGlyph">
                <div class="F3item highlightCell"> {{ Cparent1 }} </div>
                <div class="F3item" style="border-top: 1px solid #bbbbbb;"> ... </div>
                <div class="F3item highlightCell" style="border-top: 1px solid #bbbbbb;"> {{ Cparent2 }} </div>
                <div class="F3item" style="border-top: 1px solid #bbbbbb;"> ... </div>
                <div class="F3item highlightCell" style="border-top: 1px solid #bbbbbb;"> {{ Cparent3 }} </div>
                <div class="F3item" style="border-top: 1px solid #bbbbbb;"> ... </div>
              </div>
              <div class="entityMergeText"> Faceted in ≥3 groups </div>
            </div>
          </div>
        </div>
        <div v-if="configEg" class="configAttrSubpanel">
          <div class="configAttrSubpanelTitle"> Key </div>
          <a-switch size="small" :checked="typeof(key) != 'undefined'" style="display: inline-block; margin-left: 10px;" @change="changeKey"> </a-switch>
          <div v-if="typeof(key) != 'undefined'" class="wrapper" style="flex-direction: column;">
            <div class="keyPropsWrapper">
              <div style="display: inline-block" class="keyPropsText"> Position </div>
              <div v-if="Cchannel == 'row'" class="posGlyphOption" :class="{'glyphSelected': key.position == 'left'}" @click="applyChanges('key', 'position', 'left')">
                <div class="configGlyph">
                  <div class="posWrapper"> 
                    <div class="posItem1" style="border-right: 2px solid #bbbbbb"> I. </div>
                    <div class="posItem2 highlightCell"> {{ Cparent1 }} </div>
                  </div>
                </div>
                <div class="entityMergeText"> Left </div>
              </div>
              <div v-if="Cchannel == 'column'" class="cPosGlyphOption" :class="{'glyphSelected': key.position == 'top'}" @click="applyChanges('key', 'position', 'top')">
                <div class="configGlyph">
                  <div class="cPosItem" style="border-bottom: 2px solid #bbbbbb"> I. </div>
                  <div class="cPosItem highlightCell"> {{ Cparent1 }} </div>
                </div>
                <div class="entityMergeText"> Top </div>
              </div>
              <div v-if="Cchannel == 'row'" class="posGlyphOption" :class="{'glyphSelected': key.position == 'right'}" @click="applyChanges('key', 'position', 'right')">
                <div class="configGlyph">
                  <div class="posWrapper"> 
                    <div class="posItem2 highlightCell"> {{ Cparent1 }} </div>
                    <div class="posItem1" style="border-left: 2px solid #bbbbbb"> I. </div>
                  </div>
                </div>
                <div class="entityMergeText"> Right </div>
              </div>
              <div v-if="Cchannel == 'column'" class="cPosGlyphOption" :class="{'glyphSelected': key.position == 'bottom'}" @click="applyChanges('key', 'position', 'bottom')">
                <div class="configGlyph">
                  <div class="cPosItem" style="border-bottom: 2px solid #bbbbbb"> {{ Cparent1 }} </div>
                  <div class="cPosItem highlightCell"> I. </div>
                </div>
                <div class="entityMergeText"> Bottom </div>
              </div>
              <div :class="{'glyphSelected': key.position == 'embedded', 'posGlyphOption': Cchannel == 'row', 'cPosGlyphOption': Cchannel == 'column'}" @click="applyChanges('key', 'position', 'embedded')">
                <div class="configGlyph">
                  <div class="posWrapper"> 
                    <div class="posItem highlightCell"> {{ 'I. ' + Cparent1 }} </div>
                  </div>
                </div>
                <div class="entityMergeText"> embedded </div>
              </div>
            </div>
            <div class="keyPropsWrapper">
              <div style="display: inline-block" class="keyPropsText"> Pattern </div>
              <div class="posGlyphOption" :class="{'glyphSelected': key.pattern == 'I'}" @click="applyChanges('key', 'pattern', 'I')">
                <div class="configGlyph">
                  <div class="posWrapper"> 
                    <div class="posItem"> I., II., ... </div>
                  </div>
                </div>
              </div>
              <div class="posGlyphOption" :class="{'glyphSelected': key.pattern == '1'}" @click="applyChanges('key', 'pattern', '1')">
                <div class="configGlyph">
                  <div class="posWrapper"> 
                    <div class="posItem"> 1., 2., ... </div>
                  </div>
                </div>
              </div>
              <div class="posGlyphOption" :class="{'glyphSelected': key.pattern == 'A'}" @click="applyChanges('key', 'pattern', 'A')">
                <div class="configGlyph">
                  <div class="posWrapper"> 
                    <div class="posItem"> A., B., ... </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="keyPropsWrapper">
              <div style="display: inline-block" class="keyPropsText"> Hierarchy</div>
              <div class="inheritGlyphOption" :class="{'glyphSelected': key.isInherited == false}" @click="applyChanges('key', 'isInherited', false)">
                <div class="configGlyph">
                  <div class="inheritWrapper"> 
                    <div class="inheritItem"> 1., 2., 3., ... </div>
                  </div>
                </div>
                <div class="entityMergeText"> Single-level </div>
              </div>
              <div class="inheritGlyphOption" :class="{'glyphSelected': key.isInherited == true}" @click="applyChanges('key', 'isInherited', true)">
                <div class="configGlyph">
                  <div class="inheritWrapper"> 
                    <div class="inheritItem"> 1., 1.1., 1.1.1., ... </div>
                  </div>
                </div>
                <div class="entityMergeText"> Hierarchical </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="configEg" class="configAttrSubpanel">
          <div class="configAttrSubpanelTitle"> Spacing Row/Column </div> 
          <div class="wrapper" style="flex-direction: column;">
            <div class="wrapper">
              <div v-if="Cchannel == 'row'" class="glyphOption" :class="{'glyphSelected': blankLine == false}" @click="applyChanges('blankLine', false)">
                <div class="configGlyph">
                  <div class="NSItem highlightCell"> {{Cparent1}} </div>
                  <div style="border-bottom: 2px solid #bbbbbb; width: 100%;"></div>
                  <div class="NSItem highlightCell"> {{Cparent2}} </div>
                </div>
                <div class="entityMergeText"> No spacing </div>
              </div>
              <div v-if="Cchannel == 'column'" class="glyphOption" :class="{'glyphSelected': blankLine == false}" @click="applyChanges('blankLine', false)">
                <div class="configGlyph">
                  <div class="F1parent highlightCell" style="border-right: 1px solid #bbbbbb; width: 49%;"> {{ Cparent1 }} </div>
                  <div style="border-right: 1px solid #bbbbbb; height: 100%; width: 1px;"> </div>
                  <div class="F1parent highlightCell" style="width: 49%"> {{ Cparent2 }} </div>
                </div>
                <div class="entityMergeText"> No spacing </div>
              </div>
              <div v-if="Cchannel == 'row'" class="glyphOption" :class="{'glyphSelected': blankLine == true}" @click="applyChanges('blankLine', true)">
                <div class="configGlyph">
                  <div class="SItem highlightCell"> {{Cparent1}} </div>
                  <div class="SItem" style="border-top: 2px solid #bbbbbb; width: 100%; border-bottom: 2px solid #bbbbbb; width: 100%;"> </div>
                  <div class="SItem highlightCell"> {{Cparent2}} </div>
                </div>
                <div class="entityMergeText"> Spacing </div>
              </div>
              <div v-if="Cchannel == 'column'" class="glyphOption" :class="{'glyphSelected': blankLine == true}" @click="applyChanges('blankLine', true)">
                <div class="configGlyph">
                  <div class="F1parent highlightCell" style="border-right: 1px solid #bbbbbb"> {{ Cparent1 }} </div>
                  <div class="F1parent" style="border-right: 1px solid #bbbbbb;"> </div>
                  <div class="F1parent"> {{ Cparent2 }} </div>
                </div>
                <div class="entityMergeText"> No spacing </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="tab != 'table'" class="configAttrPanel">
        <div class="configAttrPanelTitle"> Style </div>
        <div v-if="background" class="configAttrSubpanel">
          <div class="configAttrSubpanelTitle"> Background </div> 
          <div class="wrapper">
            <!-- <div class="iconfont iconpaint"> &#xeb6e;</div>  -->
            <input type="color" :value="background.color" style="width: 25px; border: none; background-color: transparent;" @input="e => {background.color = e.target.value; applyChangesToStyle('background', 'color', e.target.value)}"/>
            <div class="configAttrPanelText" style="margin-left: 5px; margin-top: 5px; width: 70px;"> {{background.color}} </div>
          </div>
        </div>
        <div v-if="font" class="configAttrSubpanel">
          <div class="configAttrSubpanelTitle"> Font </div> 
          <div class="wrapper"> 
            <input type="color" :value="font.color" style="width: 25px; border: none; background-color: transparent;" @input="e => {font.color = e.target.value; applyChangesToStyle('font', 'color', e.target.value)}"/>
            <div class="configAttrPanelText" style="margin-left: 5px; margin-top: 5px; width: 70px;"> {{font.color}} </div>
            <a-input-number v-model:value="font.size" size="small" :min="1" :max="100000" style="margin-left: 30px; width: 50px; height: 24px;" @change="(value) => applyChangesToStyle('font', 'size', value)"/> 
            <div class="configAttrPanelText" style="margin-left: 5px; margin-top: 5px;"> px </div>
            <a-select v-model:value="font.weight" style="width: 100px; margin-left: 30px" size="small" @change="(value) => {applyChangesToStyle('font', 'weight', value)}">
              <a-select-option value="Bold"> Bold </a-select-option>
              <a-select-option value="Semi Bold"> Semi Bold </a-select-option>
              <a-select-option value="Regular"> Regular </a-select-option>
            </a-select>
          </div>
        </div>
        <div v-if="border" class="configAttrSubpanel">
          <div class="configAttrSubpanelTitle"> Border </div> 
          <div class="wrapper"> 
            <input type="color" :value="border.color" style="width: 25px; border: none; background-color: transparent;" @input="e => { border.color = e.target.value; applyChangesToStyle('border', 'color', e.target.value);}"/>
            <div class="configAttrPanelText" style="margin-left: 5px; margin-top: 5px; width: 70px;"> {{border.color}} </div>
            <a-input-number v-model:value="border.width" size="small" :min="1" :max="100000" style="margin-left: 30px; width: 50px; height: 24px;" @change="(value) => applyChangesToStyle('border', 'width', value)"/> 
            <div class="configAttrPanelText" style="margin-left: 5px; margin-top: 5px;"> px </div>
            <a-select v-model:value="border.position" style="width: 100px; margin-left: 30px" size="small" @change="(value) => applyChangesToStyle('border', 'position', value)">
              <a-select-option value="All"> All </a-select-option>
              <a-select-option value="Top"> Top </a-select-option>
              <a-select-option value="Bottom"> Bottom </a-select-option>
              <a-select-option value="Left"> Left </a-select-option>
              <a-select-option value="Right"> Right </a-select-option>
            </a-select>
          </div>
        </div>
      </div>
      <div v-if="tab == 'table'" class="configAttrPanel">
        <div class="configAttrPanelTitle"> Templates </div>
        <div class="configAttrSubpanel">
          <div class="configAttrSubpanelTitle"> Row/Column No. </div> 
          <div class="wrapper" style="flex-direction: column">
            <div class="keyPropsWrapper">
              <div style="display: inline-block" class="keyPropsText"> Row </div>
              <div class="glyphOption" :class="{'glyphSelected': rowNoOption == 'alternating'}" @click="applyChangesToRolColNo('odd', 'Row', rowNoColor)"
              style="margin-left: calc(25% - 72px); margin-right: calc(25% - 72px)">
                <div class="configGlyph">
                  <div class="RAitem highlightCell"> ... </div>
                  <div class="RAitem" style="border-top: 1px solid #bbbbbb;"> ... </div>
                  <div class="RAitem highlightCell" style="border-top: 1px solid #bbbbbb;"> ... </div>
                  <div class="RAitem" style="border-top: 1px solid #bbbbbb;"> ... </div>
                  <div class="RAitem highlightCell" style="border-top: 1px solid #bbbbbb;"> ... </div>
                </div>
                <div class="entityMergeText"> Alternating </div>
              </div>
              <div class="glyphOption" :class="{'glyphSelected': rowNoOption == 'none'}" @click="applyChangesToRolColNo('odd', 'Row')"
              style="margin-left: calc(25% - 72px); margin-right: calc(25% - 72px)">
                <div class="configGlyph">
                  <div class="RAitem"> ... </div>
                  <div class="RAitem" style="border-top: 1px solid #bbbbbb;"> ... </div>
                  <div class="RAitem" style="border-top: 1px solid #bbbbbb;"> ... </div>
                  <div class="RAitem" style="border-top: 1px solid #bbbbbb;"> ... </div>
                  <div class="RAitem" style="border-top: 1px solid #bbbbbb;"> ... </div>
                </div>
                <div class="entityMergeText"> None </div>
              </div>
            </div>
            <div style="margin-top: 5px;" v-if="lineNoCustomize"> 
              <div class="keyPropsWrapper">
                <div style="display: inline-block" class="keyPropsText"> Color </div>
                <input type="color" :value="rowNoColor" style="width: 25px; border: none; background-color: transparent;" @input="e => applyChangesToRolColNo(rowNoType, 'Row', e.target.value)"/>
                <div style="display: inline-block; margin-left: 5px; margin-right: 5px"> for </div>
                <a-switch size="small" checked-children="even rows" un-checked-children="odd rows" :checked="rowNoType == 'even'" @change="applyChangesToRolColNo(rowNoType == 'odd' ? 'even' : 'odd', 'Row', rowNoColor)"> </a-switch>
              </div>
            </div>
            <div class="keyPropsWrapper">
              <div style="display: inline-block" class="keyPropsText"> Column </div>
              <div class="glyphOption" :class="{'glyphSelected': colNoOption == 'alternating'}" @click="applyChangesToRolColNo('odd', 'Col', colNoColor)"
              style="margin-left: calc(25% - 72px); margin-right: calc(25% - 72px)">
                <div class="configGlyph">
                  <div class="CAitem highlightCell"> ... </div>
                  <div class="CAitem" style="border-left: 1px solid #bbbbbb; border-right: 1px solid #bbbbbb;"> ... </div>
                  <div class="CAitem highlightCell"> ... </div>
                  <div class="CAitem" style="border-left: 1px solid #bbbbbb; border-right: 1px solid #bbbbbb;"> ... </div>
                  <div class="CAitem highlightCell"> ... </div>
                </div>
                <div class="entityMergeText"> Alternating </div>
              </div>
              <div class="glyphOption" :class="{'glyphSelected': colNoOption == 'none'}" @click="applyChangesToRolColNo('odd', 'Col')"
              style="margin-left: calc(25% - 72px); margin-right: calc(25% - 72px)">
                <div class="configGlyph">
                  <div class="CAitem"> ... </div>
                  <div class="CAitem" style="border-left: 1px solid #bbbbbb; border-right: 1px solid #bbbbbb;"> ... </div>
                  <div class="CAitem"> ... </div>
                  <div class="CAitem" style="border-left: 1px solid #bbbbbb; border-right: 1px solid #bbbbbb;"> ... </div>
                  <div class="CAitem"> ... </div>
                </div>
                <div class="entityMergeText"> None </div>
              </div>
            </div>
            <div style="margin-top: 5px;" v-if="lineNoCustomize"> 
              <div class="keyPropsWrapper">
                <div style="display: inline-block" class="keyPropsText"> Color </div>
                <input type="color" :value="colNoColor" style="width: 25px; border: none; background-color: transparent;" @input="e => applyChangesToRolColNo(colNoType, 'Col', e.target.value)"/>
                <div style="display: inline-block; margin-left: 5px; margin-right: 5px"> for </div>
                <a-switch size="small" checked-children="even columns" un-checked-children="odd columns" :checked="colNoType == 'even'" @change="applyChangesToRolColNo(colNoType == 'odd' ? 'even' : 'odd', 'Col', colNoColor)"> </a-switch>
              </div>
            </div>
            <div class="templateDropdown" @click="this.lineNoCustomize = !this.lineNoCustomize">
              <i class='iconfont'> &#xeb10; </i>
            </div>
          </div>
        </div>
        <div class="configAttrSubpanel">
          <div class="configAttrSubpanelTitle"> Row Header </div> 
          <div class="wrapper" style="flex-direction: column">
            <div class="keyPropsWrapper">
              <div style="display: inline-block" class="keyPropsText"> Border </div>
              <div class="posGlyphOption" :class="{'glyphSelected': rowNoOption == 'alternating'}" @click="applyChangesToRolColNo('odd', 'Row', rowNoColor)">
                <div class="configGlyph">
                  <div class="posWrapper"> 
                    <div class="RHitem  highlightCell"> ... </div>
                    <div class="RHitem" style="width: 5px; border-left: 2px solid #bbbbbb;  border-right: 2px solid #bbbbbb; margin-left: 1px;"> &nbsp; </div>
                    <div class="RHitem"> ... </div>
                  </div>
                </div>
                <div class="entityMergeText"> Double </div>
              </div>
              <div class="posGlyphOption" :class="{'glyphSelected': rowNoOption == 'alternating'}" @click="applyChangesToRolColNo('odd', 'Row', rowNoColor)">
                <div class="configGlyph">
                  <div class="posWrapper"> 
                    <div class="RHitem  highlightCell"> ... </div>
                    <div class="RHitem" style="border-left: 3px solid #bbbbbb"> ... </div>
                  </div>
                </div>
                <div class="entityMergeText"> Single </div>
              </div>
              <div class="posGlyphOption" :class="{'glyphSelected': rowNoOption == 'none'}" @click="applyChangesToRolColNo('odd', 'Row')">
                <div class="configGlyph">
                  <div class="posWrapper"> 
                    <div class="RHitem  highlightCell"> ... </div>
                    <div class="RHitem"> ... </div>
                  </div>
                </div>
                <div class="entityMergeText"> None </div>
              </div>
            </div>
            <div style="margin-top: 5px;" v-if="rowHeaderCustomize"> 
              <div class="keyPropsWrapper">
                <div style="display: inline-block" class="keyPropsText"> Color </div>
                <input type="color" :value="rowNoColor" style="width: 25px; border: none; background-color: transparent;" @input="e => applyChangesToRolColNo(rowNoType, 'Row', e.target.value)"/>
                <div style="display: inline-block; margin-left: 5px; margin-right: 5px"> for </div>
                <a-switch size="small" checked-children="even rows" un-checked-children="odd rows" :checked="rowNoType == 'even'" @change="applyChangesToRolColNo(rowNoType == 'odd' ? 'even' : 'odd', 'Row', rowNoColor)"> </a-switch>
              </div>
            </div>
            <div class="keyPropsWrapper">
              <div style="display: inline-block" class="keyPropsText"> Font weight </div>
              <div class="inheritGlyphOption" :class="{'glyphSelected': rowHeaderFontWeight != 'Regular'}" @click="applyGlobalChanges('.rowHeader', 'font', 'weight', 'Bold')">
                <div class="configGlyph">
                  <div class="posWrapper"> 
                    <div class="posItem highlightCell" style="font-family: Inter-Bold-4" > Header </div>
                    <div class="posItem2" style="border-left: 2px solid #bbbbbb"> Cell </div>
                  </div>
                </div>
                <div class="entityMergeText"> Bold </div>
              </div>
              <div class="inheritGlyphOption" :class="{'glyphSelected': rowHeaderFontWeight == 'Regular'}" @click="applyGlobalChanges('.rowHeader', 'font', 'weight', 'Regular')">
                <div class="configGlyph">
                  <div class="posWrapper"> 
                    <div class="posItem highlightCell" > Header </div>
                    <div class="posItem2" style="border-left: 2px solid #bbbbbb"> Cell </div>
                  </div>
                </div>
                <div class="entityMergeText"> Regular </div>
              </div>
            </div>
            <div style="margin-top: 5px;" v-if="rowHeaderCustomize"> 
              <div class="keyPropsWrapper">
                <div style="display: inline-block" class="keyPropsText"> Color </div>
                <input type="color" :value="colNoColor" style="width: 25px; border: none; background-color: transparent;" @input="e => applyChangesToRolColNo(colNoType, 'Col', e.target.value)"/>
                <div style="display: inline-block; margin-left: 5px; margin-right: 5px"> for </div>
                <a-switch size="small" checked-children="even columns" un-checked-children="odd columns" :checked="colNoType == 'even'" @change="applyChangesToRolColNo(colNoType == 'odd' ? 'even' : 'odd', 'Col', colNoColor)"> </a-switch>
              </div>
            </div>
            <div class="templateDropdown" @click="this.rowHeaderCustomize = !this.rowHeaderCustomize">
              <i class='iconfont'> &#xeb10; </i>
            </div>
          </div>
        </div>
        <div class="configAttrSubpanel">
          <div class="configAttrSubpanelTitle"> Column Header </div> 
          <div class="wrapper" style="flex-direction: column">
            <div class="keyPropsWrapper">
              <div style="display: inline-block" class="keyPropsText"> Border </div>
              <div class="posGlyphOption" :class="{'glyphSelected': rowNoOption == 'alternating'}" @click="applyChangesToRolColNo('odd', 'Row', rowNoColor)">
                <div class="configGlyph">
                  <div class="posWrapper"> 
                    <div class="RHitem  highlightCell"> ... </div>
                    <div class="RHitem" style="width: 5px; border-left: 2px solid #bbbbbb;  border-right: 2px solid #bbbbbb; margin-left: 1px;"> &nbsp; </div>
                    <div class="RHitem"> ... </div>
                  </div>
                </div>
                <div class="entityMergeText"> Double </div>
              </div>
              <div class="posGlyphOption" :class="{'glyphSelected': rowNoOption == 'alternating'}" @click="applyChangesToRolColNo('odd', 'Row', rowNoColor)">
                <div class="configGlyph">
                  <div class="posWrapper"> 
                    <div class="RHitem  highlightCell"> ... </div>
                    <div class="RHitem" style="border-left: 3px solid #bbbbbb"> ... </div>
                  </div>
                </div>
                <div class="entityMergeText"> Single </div>
              </div>
              <div class="posGlyphOption" :class="{'glyphSelected': rowNoOption == 'none'}" @click="applyChangesToRolColNo('odd', 'Row')">
                <div class="configGlyph">
                  <div class="posWrapper"> 
                    <div class="RHitem  highlightCell"> ... </div>
                    <div class="RHitem"> ... </div>
                  </div>
                </div>
                <div class="entityMergeText"> None </div>
              </div>
            </div>
            <div style="margin-top: 5px;" v-if="rowHeaderCustomize"> 
              <div class="keyPropsWrapper">
                <div style="display: inline-block" class="keyPropsText"> Color </div>
                <input type="color" :value="rowNoColor" style="width: 25px; border: none; background-color: transparent;" @input="e => applyChangesToRolColNo(rowNoType, 'Row', e.target.value)"/>
                <div style="display: inline-block; margin-left: 5px; margin-right: 5px"> for </div>
                <a-switch size="small" checked-children="even rows" un-checked-children="odd rows" :checked="rowNoType == 'even'" @change="applyChangesToRolColNo(rowNoType == 'odd' ? 'even' : 'odd', 'Row', rowNoColor)"> </a-switch>
              </div>
            </div>
            <div class="keyPropsWrapper">
              <div style="display: inline-block" class="keyPropsText"> Font weight </div>
              <div class="inheritGlyphOption" :class="{'glyphSelected': colHeaderFontWeight != 'Regular'}" @click="applyGlobalChanges('.colHeader', 'font', 'weight', 'Bold')">
                <div class="configGlyph">
                  <div class="posWrapper"> 
                    <div class="posItem highlightCell" style="font-family: Inter-Bold-4" > Header </div>
                    <div class="posItem2" style="border-left: 2px solid #bbbbbb"> Cell </div>
                  </div>
                </div>
                <div class="entityMergeText"> Bold </div>
              </div>
              <div class="inheritGlyphOption" :class="{'glyphSelected': colHeaderFontWeight == 'Regular'}" @click="applyGlobalChanges('.colHeader', 'font', 'weight', 'Regular')">
                <div class="configGlyph">
                  <div class="posWrapper"> 
                    <div class="posItem highlightCell" > Header </div>
                    <div class="posItem2" style="border-left: 2px solid #bbbbbb"> Cell </div>
                  </div>
                </div>
                <div class="entityMergeText"> Regular </div>
              </div>
            </div>
            <div style="margin-top: 5px;" v-if="colHeaderCustomize"> 
              <div class="keyPropsWrapper">
                <div style="display: inline-block" class="keyPropsText"> Color </div>
                <input type="color" :value="colNoColor" style="width: 25px; border: none; background-color: transparent;" @input="e => applyChangesToRolColNo(colNoType, 'Col', e.target.value)"/>
                <div style="display: inline-block; margin-left: 5px; margin-right: 5px"> for </div>
                <a-switch size="small" checked-children="even columns" un-checked-children="odd columns" :checked="colNoType == 'even'" @change="applyChangesToRolColNo(colNoType == 'odd' ? 'even' : 'odd', 'Col', colNoColor)"> </a-switch>
              </div>
            </div>
            <div class="templateDropdown" @click="this.colHeaderCustomize = !this.colHeaderCustomize">
              <i class='iconfont'> &#xeb10; </i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { ref } from 'vue';
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return ({
      // for blocks
      entityMerge: false,
      gridMerge: "merged",
      facet: 1,
      key: undefined,
      blankLine: false,
      border: undefined,
      background: undefined,
      font: undefined, 
      tab: "attr",
      // for tables
      '.oddRows': undefined,
      '.evenRows': undefined,
      '.oddCols': undefined,
      '.evenCols': undefined,
      '.rowHeader': undefined,
      '.colHeader': undefined,
      // tmp
      lineNoCustomize: false,
      rowHeaderCustomize: false,
      colHeaderCustomize: false,
    });
  },
  computed: {
    ...mapState(["selectedBlock", "attrInfo", "configEg", "selectedTable"]),
    dataType() {
      let attrName = this.selectedBlock.attrName;
      for(let i = 0; i < this.attrInfo.length; i++) {
        if(this.attrInfo[i].name == attrName) {
          return this.attrInfo[i].dataType;
        }
      }
      return "categorical";
    },
    Cparent1() {
      let res = this.configEg.parent1 ? this.configEg.parent1 : "...";
      if(res.length > 5) return res.slice(0, 3) + "..."; else return res;
    },
    Cparent2() {
      let res = this.configEg.parent2 ? this.configEg.parent2 : "...";
      if(res.length > 5) return res.slice(0, 3) + "..."; else return res;
    },
    Cparent3() {
      let res = this.configEg.parent3 ? this.configEg.parent3 : "...";
      if(res.length > 5) return res.slice(0, 3) + "..."; else return res;
    },
    Cson1() {
      let res = this.configEg.son1 ? this.configEg.son1 : "...";
      if(res.length > 5) return res.slice(0, 3) + "..."; else return res;
    },
    Cson2() {
      let res = this.configEg.son2 ? this.configEg.son2 : "...";
      if(res.length > 5) return res.slice(0, 3) + "..."; else return res;
    },
    Cchannel() {
      return this.configEg.channel;
    },
    rowNoOption() {
      if(!this['.oddRows'] && !this['.evenRows']) return 'none';
      else return 'alternating';
    },
    colNoOption() {
      if(!this['.oddCols'] && !this['.evenCols']) return 'none';
      else return 'alternating';
    },
    rowNoType() {
      if(this['.evenRows']) {
        return 'even';
      } else {
        return 'odd';
      }
    },
    colNoType() {
      if(this['.evenCols']) {
        return 'even';
      } else {
        return 'odd';
      }
    },
    rowNoColor() {
      if(this['.oddRows']) {
        return this['.oddRows'].background.color;
      } else if(this['.evenRows']) {
        return this['.evenRows'].background.color;
      } else {
        return '#aaaaaa';
      }
    },
    colNoColor() {
      if(this['.oddCols']) {
        return this['.oddCols'].background.color;
      } else if(this['.evenCols']) {
        return this['.evenCols'].background.color;
      } else {
        return '#aaaaaa';
      }
    },
    rowHeaderFontWeight() {
      return this['.rowHeader'] ? this['.rowHeader'].font.weight : "Regular";
    },
    colHeaderFontWeight() {
      return this['.colHeader'] ? this['.colHeader'].font.weight : "Regular";
    }
  },
  methods: {
    ...mapMutations(["storeSelectedBlock"]),
    // autoApply() {
    //   // 更新selectedBlock
    //   let tmp = this.selectedBlock;
    //   tmp.entityMerge = this.entityMerge;
    //   this.storeSelectedBlock(tmp);

    //   // 更新tree
    //   this.$bus.emit("update", tmp);
    // },
    applyChanges(key1, key2, value) {
      console.log("config changes: ", key1, key2, value);
      if(typeof(value) != 'undefined') {
        let oldValue = this.key1 ? this[key1][key2] : undefined;
        if(oldValue == value) return;
        if(!this[key1]) this[key1] = {};
        this[key1][key2] = value;
        let block = this.selectedBlock;
        if(!block[key1]) block[key1] = {};
        block[key1][key2] = value;
        this.storeSelectedBlock(block);
        // 更新tree
        this.$bus.emit("update", block);
      } else {
        value = key2;
        let oldValue = this[key1];
        if(oldValue == value) return;
        this[key1] = value;
        let block = this.selectedBlock;
        block[key1] = value;
        this.storeSelectedBlock(block);
        // 更新tree
        this.$bus.emit("update", block);
      }
    },
    applyChangesToStyle(key1, key2, value) {
      console.log("style changes: ", key1, key2, value);
      let oldValue = this.key1 ? this[key1][key2] : undefined;
      if(oldValue == value) return;
      if(!this[key1]) this[key1] = {};
      this[key1][key2] = value;
      let block = this.selectedBlock;
      if(!block.style || typeof(block.style) != 'object') block.style = {};
      if(!block.style[key1]) block.style[key1] = {};
      block.style[key1][key2] = value;
      this.storeSelectedBlock(block);
      // 更新tree
      this.$bus.emit("update", block);
    },
    changeKey(checked) {
      let block = this.selectedBlock;
      if(checked) {
        this.key = {
          position: 'embedded',
          pattern: 'A',
          isInherited: true,
        }
        block.key = {
          position: 'embedded',
          pattern: 'A',
          isInherited: true,
        }
      } else {
        this.key = undefined;
        block.key = undefined;
      }
      this.storeSelectedBlock(block);
      // 更新tree
      this.$bus.emit("update", block);
    },
    applyChangesToRolColNo(type, pos, color) {
      let s = `.${type}${pos}s`, t = `.${type == 'odd' ? 'even' : 'odd'}${pos}s`;
      this[s] = color ? {
        background: {
          color: color,
        }
      } : undefined;
      this[t] = undefined;
      let styles = this.selectedTable;
      styles[s] = color ? {
        background: {
          color: color,
        }
      } : undefined;
      styles[t] = undefined;
      this.$bus.emit('updateglobal', styles);
    },
    applyGlobalChanges(className, key1, key2, value) {
      console.log("global changes: ", className, key1, key2, value);
      // if(className == '.oddRows' || className == '.evenRows') {
      //   if(key1) {
      //     this.rowNoPattern = {
      //       type: className == '.oddRows' ? 'odd' : 'even',
      //       color: value,
      //     }
      //   } else {
      //     this.rowNoPattern = undefined;
      //   }
      // }
      if(!this[className]) this[className] = {};
      if(key1) {
        if(!this[className][key1]) this[className][key1] = {};
        if(key2) this[className][key1][key2] = value;
        else this[className][key1] = undefined;
      } else {
        this[className] = undefined;
      }
      
      let styles = this.selectedTable;
      if(!styles || typeof(styles) != 'object') styles = {};
      if(!styles[className]) styles[className] = {};
      if(key1) {
        if(!styles[className][key1]) styles[className][key1] = {};
        if(key2) styles[className][key1][key2] = value;
        else styles[className][key1] = undefined;
      } else {
        styles[className] = undefined;
      }

      this.$bus.emit('updateglobal', styles);

      // this.$bus.emit("updateglobal", {
      //   className,
      //   key1,
      //   key2,
      //   value,
      // });
    }
  },
  watch: {
    selectedBlock(val, oldval) {
      if(typeof(val) != 'undefined' && val != oldval) {
        // set default values
        this.entityMerge = (typeof(val.entityMerge) != 'undefined') ? val.entityMerge : false;
        this.gridMerge = (typeof(val.gridMerge) != 'undefined') ? val.gridMerge : "merged";
        this.facet = (typeof(val.facet) != 'undefined') ? val.facet : 1;
        this.key = val.key;
        this.blankLine = (typeof(val.blankLine) != 'undefined') ? val.blankLine : false;
        this.border = (val.style && val.style.border) ? val.style.border : {
          color: '#000000',
          width: 1,
          position: "all",
        };
        this.background = (val.style && val.style.background) ? val.style.background : {
          color: '#ffffff',
        };
        this.font = (val.style && val.style.font) ? val.style.font : {
          color: '#000000',
          size: 12,
          weight: 'Regular'
        };
        
      }
    },
    selectedTable(val, oldval) {
      if(val != oldval) {
        // set default values
        // this.rowNoPattern = (typeof(val['.oddRows']) != 'undefined') ? {
        //   type: 'odd',
        //   color: val['.oddRows'].background.color,
        // } : (typeof(val['.evenRows']) != 'undefined') ? {
        //   type: 'even',
        //   color: val['.evenRows'].background.color,
        // } : undefined;
        // this.colNoPattern = (typeof(val['.oddCols']) != 'undefined') ? {
        //   type: 'odd',
        //   color: val['.oddCols'].background.color,
        // } : (typeof(val['.evenCols']) != 'undefined') ? {
        //   type: 'even',
        //   color: val['.evenCols'].background.color,
        // } : undefined;
        this['.oddRows'] = val['.oddRows'];
        this['.oddCols'] = val['.oddCols'];
        this['.evenRows'] = val['.evenRows'];
        this['.evenCols'] = val['.evenCols'];
        this['.rowHeader'] = val['.rowHeader'];
        this['.colHeader'] = val['.colHeader'];
      }
    }
    // entityMerge(val, oldval) {
    //   if(typeof(val) != 'undefined' && val != oldval) {
    //     this.autoApply();
    //   }
    // }
  },
}
// defineProps({
//   msg: String,
// })

// const count = ref(0)
</script>

<style scoped>
.configview {
  height: calc(100% - 55px);
  width: 20%;
  position: absolute;
  padding: 15px 20px 15px 20px;
  overflow-y: scroll;
}

.configTabSelected {
  display: inline-block;
  border-bottom: 2px solid #526D82;
  padding-left: 5px;
  padding-right: 5px;
  font-family: Inter-Medium-8, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  width: 50%;
  text-align: center;
  font-size: 17px;
}

.configTabUnselected {
  display: inline-block;
  border-bottom: 1px solid rgba(82, 110, 130, 0.5);
  padding-left: 5px;
  padding-right: 5px;
  font-family: Inter-Regular-9;
  width: 50%;
  text-align: center;
  color: #526D82;
}

.configTabUnselected:hover {
  color: #333333;
  border-bottom: 1.25px solid rgba(82, 110, 130, 0.5);
}

.configview::-webkit-scrollbar {
  display: none;
}

.configAttrHeader {
  /* height: 50px; */
  /* border-bottom: 1px solid #526D82; */
  margin-bottom: 5px;
}

.configAttrHeaderIcon {
  display: inline-block;
  font-size: 17px;
  margin-right: 5px;
}

.configAttrHeaderText {
  display: inline-block;
  /* cursor: pointer; */
}

.configAttrPanel {
  /* margin-top: 10px; */
  border-bottom: 1px solid #526D82;
  padding-top: 10px;
  padding-bottom: 10px;
}

.configAttrPanelTitle {
  font-size: 15px;
  font-family: Inter-Bold-4, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.configAttrSubpanel {
  margin-top: 7px;
}

.configAttrSubpanelSelect {
  float: right;
  width: 100px;
  font-family: Inter-Regular-9, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.configAttrSubpanelTitle {
  display: inline-block;
  font-size: 15px;
  font-family: Inter-Medium-8, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  margin-bottom: 5px;
}

.configAttrPanelText {
  display: inline-block;
  font-size: 15px;
  font-family: Inter-Regular-9, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  /* margin-bottom: 5px; */
}

.wrapper {
  padding: 8px 8px;
  background-color: #DDE6ED;
  border-radius: 5px;
  display: flex;
}

.configGlyph {
  width: 100px;
  height: 65px;
  font-size: 14px;
  font-family: Inter-Regular-9, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 5px 5px;
  border: 1px solid #cccccc;
  border-radius: 5px;
}


.glyphOption:hover {
  box-shadow: 0 1px 2px 4px rgba(0, 0, 0, 0.08),
      0 1px 6px -5px rgba(0, 0, 0, 0.07),
      0 2px 4px 4px rgba(0, 0, 0, 0.07)
}

.glyphSelected {
  box-shadow: 0 1px 2px 4px rgba(0, 0, 0, 0.13),
      0 1px 6px -5px rgba(0, 0, 0, 0.12),
      0 2px 4px 4px rgba(0, 0, 0, 0.12) !important;
}

.EUMparent {
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  width: 50%;
  height: 100%;
  justify-content: center;
  border-collapse: collapse;
}

.EUMsonwrapper {
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  width: 50%;
  height: 100%;
  justify-content: center;
  border-left: 1px solid #cccccc;
}

.EUMson {
  height: 50%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-collapse: collapse;
}

.glyphOption {
  display: inline-block;
  width: 110px;
  margin-left: calc(25% - 55px);
  margin-right: calc(25% - 55px);
  padding: 2px 5px;
}

.EMparent {
  height: 33.3%;
  width: 100%;
  display: flex;
  padding-left: 5px;
}

.EMson {
  height: 33.3%;
  width: 100%;
  display: flex;
  padding-left: 25px;
  border-top: 1px solid #cccccc;
}

.entityMergeText {
  width: 100px;
  text-align: center;
  margin-top: 5px;
  font-size: 15px;
  font-family: Inter-Regular-9, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.FglyphOption .entityMergeText{
  width: 110px;
}

.GUMparentwrapper {
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.GUMparent {
  height: 100%;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.GUMsonwrapper {
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.GUMson {
  height: 100%;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.Fwrapper {
  height: 100%;
  width: 100%;
}

.highlightCell {
  background-color: #e4e4e4;
  border-radius: 5px;
}

.facetText {
  margin-top: 5px;
  font-size: 15px;
  font-family: Inter-Regular-9, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.FglyphOption {
  display: inline-block;
  width: 120px;
  margin-left: calc(16.7% - 60px);
  margin-right: calc(16.7% - 60px);
  padding: 2px 5px;
}

.FglyphOption .configGlyph {
  width: 110px;
  height: 80px;
}

.FglyphOption:hover {
  box-shadow: 0 1px 2px 4px rgba(0, 0, 0, 0.08),
      0 1px 6px -5px rgba(0, 0, 0, 0.07),
      0 2px 4px 4px rgba(0, 0, 0, 0.07)
}

.F1parentwrapper {
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.F1parent {
  height: 100%;
  width: 33.3%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.F1sonwrapper {
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.F1son {
  font-size: 10px;
  height: 100%;
  width: 33.3%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.F2wrapper {
  width: 100%;
  height: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.F2item {
  height: 100%;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.F3item {
  height: 16.6%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.posGlyphOption {
  display: inline-block;
  width: 80px;
  margin-left: calc(16.7% - 55px);
  margin-right: calc(16.7% - 55px);
  padding: 2px 5px;
}

.posGlyphOption .configGlyph {
  width: 70px;
  height: 20px;
}

.posGlyphOption:hover {
  box-shadow: 0 1px 2px 4px rgba(0, 0, 0, 0.08),
      0 1px 6px -5px rgba(0, 0, 0, 0.07),
      0 2px 4px 4px rgba(0, 0, 0, 0.07)
}

.posWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.posItem1 {
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.posItem2 {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.posItem {
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.keyPropsWrapper {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  margin-top: 5px;
}

.posGlyphOption .entityMergeText {
  width: 70px;
}

.keyPropsText {
  display: inline-block;
  font-size: 14px;
  width: 70px;
  font-family: Inter-Medium-8, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.inheritGlyphOption {
  display: inline-block;
  margin-left: calc(16.7% - 55px);
  margin-right: calc(16.7% - 55px);
  padding: 2px 5px;
}

.inheritGlyphOption .configGlyph {
  width: 110px;
  height: 20px;
}

.inheritGlyphOption:hover {
  box-shadow: 0 1px 2px 4px rgba(0, 0, 0, 0.08),
      0 1px 6px -5px rgba(0, 0, 0, 0.07),
      0 2px 4px 4px rgba(0, 0, 0, 0.07)
}

.inheritWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inheritItem {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.inheritGlyphOption .entityMergeText{
  width: 110px;
}

/* .SWrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 10px;
} */

.NSItem {
  display: flex;
  height: 50%;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.SItem {
  display: flex;
  height: 33.3%;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.RAitem {
  height: 20%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  padding-bottom: 5px;
}

.CAitem {
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* vertical-align: center; */
  justify-content: center;
  align-items: center;
  padding-bottom: 5px;
}

.RHitem {
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cPosGlyphOption {
  display: inline-block;
  width: 80px;
  margin-left: calc(16.7% - 55px);
  margin-right: calc(16.7% - 55px);
  padding: 2px 5px;
}

.templateDropdown {
  margin-top: 5px;
  width: 100%;
  height: 18px;
  background-color: rgba(157, 178, 191, 0.5);
  text-align: center; 
  color: #666666; 
  line-height: 15px;
  border-radius: 5px;
  font-size: 20px;
}

.templateDropdown:hover {
  background-color: rgba(157, 178, 191, 0.75);
}

.cPosGlyphOption:hover {
  box-shadow: 0 1px 2px 4px rgba(0, 0, 0, 0.08),
      0 1px 6px -5px rgba(0, 0, 0, 0.07),
      0 2px 4px 4px rgba(0, 0, 0, 0.07)
}

.cPosGlyphOption .configGlyph {
  width: 70px;
  height: 45px;
}

.cPosItem {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cPosGlyphOption .entityMergeText {
  width: 70px;
}

.iconpaint {
  font-size: 22px;
  display: inline-block;
  margin-right: 10px;
  font-weight: 5px;
}
</style>
