var rootVMContainerName = "RootVmContainer";

$(document).ready(function () {

    $.ajaxSetup({
        error: function () { ReportError(true); }
    });

    initRootVM();
});

function initRootVM() {
    var ViewModel = function () {
        this.OnReady = new ko.subscribable();

        var self = this;

        this.RegisterChild = function (vm, name) {
            self[name] = vm;

            vm.OnReady.subscribe(function () {
                self.OnReady.notifySubscribers();
            });
        };
    };

    var rootVmContainer = document.createElement('div');
    rootVmContainer.setAttribute('id', rootVMContainerName);
    document.body.appendChild(rootVmContainer);

    ko.applyBindings(new ViewModel, rootVmContainer);
}

function ReportError(doReport) {

    if (doReport == null) {
        doReport = true;
    }

    $('#ErrorContainer').toggleClass('hidden', !doReport);
}

function RootVM() {
    return ko.dataFor($(document.body).find('#RootVmContainer')[0]);
}