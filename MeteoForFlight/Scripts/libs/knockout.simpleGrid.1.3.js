(function () {


    // Private function
    function getColumnsForScaffolding(data) {
        if ((typeof data.length !== 'number') || data.length === 0) {
            return [];
        }
        var columns = [];
        for (var propertyName in data[0]) {
            columns.push({ headerText: propertyName, rowText: propertyName });
        }
        return columns;
    }

    ko.simpleGrid = {
        // Defines a view model class you can use to populate a grid
        viewModel: function (configuration) {
            var self = this;
            this.data = configuration.data;
            this.dataReader = configuration.dataReader;
            this.currentPageIndex = ko.observable(0);
            this.pageSize = configuration.pageSize || 10;
            this.onRowClick = configuration.onRowClick;
            this.checkable = configuration.checkable;
            // If you don't specify columns configuration, we'll use scaffolding
            this.columns = configuration.columns || getColumnsForScaffolding(ko.utils.unwrapObservable(this.data));
            this.showFooter = configuration.showFooter;
            this.footerViewModel = configuration.footerViewModel;
            this.sortOrder = true;
            this.sortAsc = function (sender) {
                var prop = sender.sortProperty;
                var sortOrder = self.sortOrder;
                self.data.sort(function (a, b) {
                    if (self.sortOrder) {
                        return a[prop]() > b[prop]() ? -1 : 1;
                    } else {
                        return a[prop]() < b[prop]() ? -1 : 1;
                    }
                });
                self.sortOrder = !sortOrder;
            };

            if (configuration.selectedItems != undefined) {
                self.selectedItems = configuration.selectedItems;
                self.selectedAll = ko.dependentObservable({
                    read: function () {
                        return self.selectedItems().length === self.data().length;
                    },
                    write: function () {
                        if (self.selectedItems().length === self.data().length) {
                            self.selectedItems([]);

                        } else {
                            ko.utils.arrayForEach(self.data(), function (item) {
                                if (self.selectedItems.indexOf(item.TaskId()) < 0) {
                                    self.selectedItems.push(item.TaskId());
                                }
                            });
                        }
                    }
                });
            }

            this.itemsOnCurrentPage = ko.computed(function () {
                var startIndex = this.pageSize * this.currentPageIndex();
                return this.data.slice(startIndex, startIndex + this.pageSize);
            }, this);


            this.maxPageIndex = ko.computed(function () {
                return Math.ceil(ko.utils.unwrapObservable(this.data).length / this.pageSize) - 1;
            }, this);

            this.smallList = ko.computed(function () {
                return this.maxPageIndex() < 1;
            }, this);

            this.bigList = ko.computed(function () {
                return this.maxPageIndex() > 5;
            }, this);


            this.leftPageIndex = ko.computed(function () {
                if (!this.smallList()) {
                    return Math.max(this.currentPageIndex() /*- 1*/, 0);
                } else {
                    return 0;
                }
            }, this);

            this.rightPageIndex = ko.computed(function () {
                if (!this.smallList()) {
                    return Math.min(this.maxPageIndex(), this.currentPageIndex() /*+ 1*/);
                } else {
                    return this.maxPageIndex();
                }
            }, this);

            ///--------------------------------------------------------------------------------------

            this.firstPage = ko.computed(function () {
                return this.currentPageIndex() == 0;
            }, this);

            this.lastPage = ko.computed(function () {
                return this.currentPageIndex() == this.maxPageIndex();
            }, this);

            this.moreThenOnePage = ko.computed(function () {
                return this.maxPageIndex() > 0;
            }, this);
            ///--------------------------------------------------------------------------------------

            this.goToNext = function () {

                var page = this.currentPageIndex();
                if (page < this.maxPageIndex()) {
                    this.currentPageIndex(page + 1);
                } else {
                    this.currentPageIndex(page);
                }

            };

            this.goToPrev = function () {
                var page = this.currentPageIndex();
                if (page > 0) {
                    this.currentPageIndex(page - 1);
                } else {
                    this.currentPageIndex(0);
                }

            };

            this.goToFirst = function () {
                this.currentPageIndex(0);
            };

            this.goToLast = function () {
                this.currentPageIndex(this.maxPageIndex());
            };
        }
    };

    // Templates used to render the grid
    var templateEngine = new ko.nativeTemplateEngine();

    templateEngine.addTemplate = function (templateName, templateMarkup) {
        document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
    };

    templateEngine.addTemplate("ko_simpleGrid_grid", "\
                    <table class=\"ko-grid\" cellspacing=\"0\">\
                        <thead>\
                            <tr>\
								<!-- ko if: typeof checkable != 'undefined' && checkable -->\
											<th>\
												 <input type=\"checkbox\" id=\"cbCheckAll\" data-bind=\"checked: selectedAll\"/>\
											</th>\
								<!-- /ko -->\
								<!-- ko foreach: columns -->\
										<th data-bind=\"style: $data.cellStyle, css: { 'tablet-hide': typeof showForTablets != 'undefined' && !showForTablets, 'sphone-hide': typeof showForSmartphones != 'undefined' && !showForSmartphones }\" style=\" min-width: 90px;\">\
										 <div data-bind=\"text: headerText\"></div>\
										   <div data-bind=\"if: typeof sortable!= 'undefined' && sortable\">\
								 				<button data-bind=\"click:  $parent.sortAsc\" class='button-sort'></button>\
											</div>\
	                                   </th>\
								<!-- /ko -->\
					    	</tr>\
                        </thead>\
                        <tbody data-bind=\"foreach: itemsOnCurrentPage\">\
                           <tr>\
							   <!-- ko if: typeof $parent.checkable != 'undefined' && $parent.checkable -->\
											<td >\
											  <input type=\"checkbox\"  data-bind=\"value: $data.TaskId(), checked: $parent.selectedItems\"/>\
											</td>\
								<!-- /ko -->\
								<!-- ko foreach: $parent.columns -->\
                                    <!-- ko if: typeof $root.onRowClick === 'undefined' -->\
									<td class=\"no-pointer\" data-bind=\"attr: {'data-label': headerText}, text: typeof rowText == 'function' ? rowText($parent) : $parent[rowText], css: { 'tablet-hide': typeof showForTablets != 'undefined' && !showForTablets, 'sphone-hide': typeof showForSmartphones != 'undefined' && !showForSmartphones } \"></td>\
                                    <!-- /ko -->\
	                                <!-- ko ifnot: typeof $root.onRowClick === 'undefined' -->\
									<td data-bind=\"attr: {'data-label': headerText}, text: typeof rowText == 'function' ? rowText($parent) : $parent[rowText], click: function() { $root.onRowClick($parent)}, css: { 'tablet-hide': typeof showForTablets != 'undefined' && !showForTablets, 'sphone-hide': typeof showForSmartphones != 'undefined' && !showForSmartphones }\"></td>\
                                    <!-- /ko -->\
								 <!-- /ko -->\
						  </tr>\
                        </tbody>\
                        <!-- ko if: typeof $data.showFooter != 'undefined' && $data.showFooter -->\
                            <tfoot>\
                                <tr>\
                                    <!-- ko foreach: columns -->\
                                        <!-- ko if: typeof $data.footerTemplate === 'undefined' -->\
                                            <td/>\
                                        <!-- /ko -->\
                                        <!-- ko ifnot: typeof $data.footerTemplate === 'undefined' -->\
                                            <td class=\"no-pointer\" data-bind=\"attr: {'data-label': headerText}, css: { 'tablet-hide': typeof showForTablets != 'undefined' && !showForTablets, 'sphone-hide': typeof showForSmartphones != 'undefined' && !showForSmartphones } \">\
                                                <div data-bind=\"template: {name: $data.footerTemplate, data: $parent.footerViewModel, afterRender: $data.footerAfterRender}\">\
                                            </td>\
                                        <!-- /ko -->\
						            <!-- /ko -->\
                                </tr>\
                            </tfoot>\
                        <!-- /ko -->\
                    </table>");
    templateEngine.addTemplate("ko_simpleGrid_pageLinks", "\
                    <div class=\"ko-grid-pageLinks\" data-bind=\"visible: moreThenOnePage()\">\
                         Page: <a href=\"#\" data-bind=\"click: goToFirst, visible: !firstPage() && bigList() \">First</a> <a href=\"#\" data-bind=\"click: goToPrev, visible: !firstPage() && !smallList() \">Prev</a>\
                        <!-- ko foreach: ko.utils.range(leftPageIndex, rightPageIndex) -->\
                               <a href=\"#\" data-bind=\"text: $data + 1, click: function() { $root.currentPageIndex($data) }, css: { selected: $data == $root.currentPageIndex() }\">\
                            </a>\
                        <!-- /ko -->\
                    <a href=\"#\" data-bind=\"click: goToNext, visible: !lastPage() && !smallList() \">Next</a> <a href=\"#\" data-bind=\"click: goToLast, visible: !lastPage() && bigList() \">Last</a>\
                    </div>");

    // The "simpleGrid" binding
    ko.bindingHandlers.simpleGrid = {
        init: function () {
            return { 'controlsDescendantBindings': true };
        },
        // This method is called to initialize the node, and will also be called again if you change what the grid is bound to
        update: function (element, viewModelAccessor, allBindingsAccessor) {
            var viewModel = viewModelAccessor(), allBindings = allBindingsAccessor();

            // Empty the element
            while (element.firstChild)
                ko.removeNode(element.firstChild);

            // Allow the default templates to be overridden
            var gridTemplateName = allBindings.simpleGridTemplate || "ko_simpleGrid_grid",
                pageLinksTemplateName = allBindings.simpleGridPagerTemplate || "ko_simpleGrid_pageLinks";

            // Render the main grid
            var gridContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(gridTemplateName, viewModel, { templateEngine: templateEngine }, gridContainer, "replaceNode");

            // Render the page links
            var pageLinksContainer = element.appendChild(document.createElement("DIV"));
            ko.renderTemplate(pageLinksTemplateName, viewModel, { templateEngine: templateEngine }, pageLinksContainer, "replaceNode");
        }
    };
})();