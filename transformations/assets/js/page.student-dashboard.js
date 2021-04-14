! function(e) {
    var t = {};

    function r(o) {
        if (t[o]) return t[o].exports;
        var s = t[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return e[o].call(s.exports, s, s.exports, r), s.l = !0, s.exports
    }
    r.m = e, r.c = t, r.d = function(e, t, o) {
        r.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: o
        })
    }, r.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, r.t = function(e, t) {
        if (1 & t && (e = r(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var o = Object.create(null);
        if (r.r(o), Object.defineProperty(o, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var s in e) r.d(o, s, function(t) {
                return e[t]
            }.bind(null, s));
        return o
    }, r.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return r.d(t, "a", t), t
    }, r.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, r.p = "/", r(r.s = 395)
}({
    395: function(e, t, r) {
        e.exports = r(396)
    },
    396: function(e, t) {
        ! function() {
            "use strict";
            Charts.init();
            var d = [0, 10, 5, 15, 10, 20, 15];
            var index = 0;
            var e = [],
                t = moment().subtract(6, "days").format("YYYY-MM-DD"),
                r = moment().format("YYYY-MM-DD");
            moment.range(t, r).by("days", function(t) {
                e.push({
                    y: d[index],
                    x: t.toDate()
                });
                index++;
            });
            ! function(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "radar",
                    r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
                r = Chart.helpers.merge({
                    elements: {
                        point: {
                            pointStyle: "circle",
                            radius: 4,
                            hoverRadius: 5,
                            backgroundColor: settings.colors.white,
                            borderColor: settings.colors.primary[500],
                            borderWidth: 2
                        }
                    },
                    scale: {
                        ticks: {
                            display: !1,
                            beginAtZero: !0,
                            maxTicksLimit: 4
                        },
                        gridLines: {
                            color: "dark" == settings.charts.colorScheme ? settings.colors.gray[900] : settings.colors.gray[300]
                        },
                        angleLines: {
                            color: "dark" == settings.charts.colorScheme ? settings.colors.gray[900] : settings.colors.gray[300]
                        },
                        pointLabels: {
                            fontSize: 14
                        }
                    },
                    tooltips: {
                        callbacks: {
                            label: function(e, t) {
                                var r = t.datasets[e.datasetIndex].label || "",
                                    o = e.yLabel,
                                    s = "";
                                return 1 < t.datasets.length && (s += '<span class="popover-body-label mr-auto">' + r + "</span>"), s + '<span class="popover-body-value">' + o + "%</span>"
                            }
                        }
                    }
                }, r);
                var o = {
                    labels: ["Numbers", "Algebra", "Ratio's", "Geometry", "Probability", "Statistics"],
                    datasets: [{
                        label: "Experience IQ",
                        data: [45, 33, 32, 31, 30, 18],
                        pointHoverBorderColor: settings.colors.success[400],
                        pointHoverBackgroundColor: settings.colors.white,
                        borderJoinStyle: "bevel",
                        lineTension: .1
                    }]
                };
                Charts.create(e, t, r, o)
            }("#topicIqChart")
        }()
    }
});

let data = {
    labels: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun"
    ],
    datasets: [{
        data: [0, 10, 25, 35, 50, 69]
    }]
}

let options = {
    elements: {
        point: {
            pointStyle: "circle",
            radius: 4,
            hoverRadius: 5,
            backgroundColor: settings.colors.white,
            borderColor: settings.colors.primary[500],
            borderWidth: 2
        }
    },
    scales: {
        yAxes: [{
            gridLines: {
                display: true,
				color: ['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.2)']
            },
            ticks: {
                beginAtZero: true,
                stepSize: 20,
                max: 100,
                callback: function(a) {
                    if (!(a % 10))
                        return a + "%"
                    }
            }
        }]
    },
    tooltips: {
        callbacks: {
            label: function(a, e) {
            var t = e.datasets[a.datasetIndex].label || "",
                o = a.yLabel,
                r = "";
            return 1 < e.datasets.length && (r += '<span class="popover-body-label mr-auto">' + t + "</span>"), r += '<span class="popover-body-value">' + o + "%</span>"
            }
        }
    }
}

Charts.create('#curriculumChart', 'line', options, data);