"use strict";

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect,
  useRef = _React.useRef,
  useCallback = _React.useCallback;

// ── Socket 連線（連接到同一台伺服器）
var socket = io();
var TIMER_TOTAL = 15;
var REMS = ['🥇', '🥈', '🥉'];
var COLORS = ['#1f6feb', '#e3b341', '#da3633', '#3fb950', '#bc8cff', '#f78166', '#58a6ff'];
function avatarColor(name) {
  return COLORS[name.charCodeAt(0) % COLORS.length];
}
function Avatar(_ref) {
  var name = _ref.name,
    _ref$size = _ref.size,
    size = _ref$size === void 0 ? 28 : _ref$size;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      background: avatarColor(name),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: size * .38,
      color: '#000',
      flexShrink: 0
    }
  }, name.slice(0, 1).toUpperCase());
}
function TimerRing(_ref2) {
  var sec = _ref2.sec,
    total = _ref2.total;
  var r = 28,
    circ = 2 * Math.PI * r,
    frac = sec / total,
    off = circ * (1 - frac);
  var cls = sec <= 5 ? 'danger' : sec <= 8 ? 'warn' : 'ok';
  return /*#__PURE__*/React.createElement("div", {
    className: "timer-wrap",
    style: {
      position: 'absolute',
      top: 20,
      right: 20
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "68",
    height: "68",
    className: "timer-svg",
    viewBox: "0 0 68 68"
  }, /*#__PURE__*/React.createElement("circle", {
    className: "t-track",
    cx: "34",
    cy: "34",
    r: r
  }), /*#__PURE__*/React.createElement("circle", {
    className: "t-fill ".concat(cls),
    cx: "34",
    cy: "34",
    r: r,
    strokeDasharray: circ,
    strokeDashoffset: off
  }), /*#__PURE__*/React.createElement("text", {
    x: "34",
    y: "34",
    textAnchor: "middle",
    dominantBaseline: "central",
    transform: "rotate(90,34,34)",
    style: {
      fill: '#e6edf3',
      fontSize: 17,
      fontWeight: 700,
      fontFamily: "'Space Grotesk',sans-serif"
    }
  }, sec)));
}
function Leaderboard(_ref3) {
  var players = _ref3.players;
  var sorted = _toConsumableArray(players).sort(function (a, b) {
    return b.score - a.score;
  }).slice(0, 10);
  var rnkCls = ['c1', 'c2', 'c3'];
  return /*#__PURE__*/React.createElement("div", {
    className: "lb"
  }, sorted.map(function (p, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: "lb-item ".concat(i < 3 ? 'r' + (i + 1) : '')
    }, /*#__PURE__*/React.createElement("span", {
      className: "lb-rank ".concat(rnkCls[i] || 'cn')
    }, REMS[i] || i + 1), /*#__PURE__*/React.createElement(Avatar, {
      name: p.name,
      size: 24
    }), /*#__PURE__*/React.createElement("span", {
      className: "lb-name"
    }, p.name), p.answered !== undefined && (p.answered ? /*#__PURE__*/React.createElement("span", {
      className: "lb-answered"
    }) : /*#__PURE__*/React.createElement("span", {
      className: "lb-unanswered"
    })), /*#__PURE__*/React.createElement("span", {
      className: "lb-score"
    }, p.score));
  }), players.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      color: 'var(--muted)',
      fontSize: 12,
      padding: '16px 0'
    }
  }, "\u7B49\u5F85\u73A9\u5BB6\u52A0\u5165..."));
}

// ══════════════════════════════════════════
// HOST VIEW
// ══════════════════════════════════════════
function HostView() {
  var _useState = useState('lobby'),
    _useState2 = _slicedToArray(_useState, 2),
    gameStatus = _useState2[0],
    setGameStatus = _useState2[1];
  var _useState3 = useState([]),
    _useState4 = _slicedToArray(_useState3, 2),
    players = _useState4[0],
    setPlayers = _useState4[1];
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    question = _useState6[0],
    setQuestion = _useState6[1];
  var _useState7 = useState(null),
    _useState8 = _slicedToArray(_useState7, 2),
    revealData = _useState8[0],
    setRevealData = _useState8[1];
  var _useState9 = useState(null),
    _useState0 = _slicedToArray(_useState9, 2),
    gameOver = _useState0[0],
    setGameOver = _useState0[1];
  var _useState1 = useState(TIMER_TOTAL),
    _useState10 = _slicedToArray(_useState1, 2),
    timeLeft = _useState10[0],
    setTimeLeft = _useState10[1];
  var _useState11 = useState(''),
    _useState12 = _slicedToArray(_useState11, 2),
    err = _useState12[0],
    setErr = _useState12[1];
  var timerRef = useRef(null);
  useEffect(function () {
    socket.emit('host:join');
    socket.on('host:state', function (_ref4) {
      var status = _ref4.status,
        players = _ref4.players,
        questionIndex = _ref4.questionIndex,
        q = _ref4.question;
      setGameStatus(status);
      setPlayers(players || []);
    });
    socket.on('host:playerList', function (p) {
      setPlayers(p);
    });
    socket.on('host:question', function (q) {
      setQuestion(q);
      setRevealData(null);
      setGameStatus('question');
      setTimeLeft(q.timer);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(function () {
        return setTimeLeft(function (t) {
          if (t <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    });
    socket.on('host:reveal', function (d) {
      setRevealData(d);
      setGameStatus('revealing');
      clearInterval(timerRef.current);
    });
    socket.on('host:gameOver', function (d) {
      setGameOver(d);
      setGameStatus('gameover');
    });
    socket.on('host:error', function (m) {
      return setErr(m);
    });
    return function () {
      clearInterval(timerRef.current);
      ['host:state', 'host:playerList', 'host:question', 'host:reveal', 'host:gameOver', 'host:error'].forEach(function (e) {
        return socket.off(e);
      });
    };
  }, []);
  if (gameStatus === 'gameover' && gameOver) {
    var _leaderboard = gameOver.leaderboard,
      winners = gameOver.winners;
    var ordered = [winners.find(function (w) {
      return w.rank === 2;
    }), winners.find(function (w) {
      return w.rank === 1;
    }), winners.find(function (w) {
      return w.rank === 3;
    })].filter(Boolean);
    return /*#__PURE__*/React.createElement("div", {
      className: "go-wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "go-title"
    }, "\uD83C\uDFC6 \u904A\u6232\u7D50\u675F\uFF01"), /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--muted)',
        fontSize: 13,
        marginBottom: 28
      }
    }, "\u611F\u8B1D\u6240\u6709\u540C\u5B78\u7684\u53C3\u8207"), /*#__PURE__*/React.createElement("div", {
      className: "podium"
    }, ordered.map(function (w) {
      return /*#__PURE__*/React.createElement("div", {
        key: w.rank,
        className: "pod p".concat(w.rank)
      }, /*#__PURE__*/React.createElement("div", {
        className: "pod-av"
      }, w.name.slice(0, 1).toUpperCase()), /*#__PURE__*/React.createElement("div", {
        className: "pod-blk"
      }, w.rank), /*#__PURE__*/React.createElement("div", {
        className: "pod-name"
      }, w.name), /*#__PURE__*/React.createElement("div", {
        className: "pod-score"
      }, w.score, " \u5206"), /*#__PURE__*/React.createElement("div", {
        className: "code-badge",
        style: w.rank > 1 ? {
          fontSize: 14,
          padding: '4px 10px',
          letterSpacing: 2
        } : {}
      }, w.code));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--muted)',
        fontSize: 12,
        marginBottom: 24
      }
    }, "\u524D\u4E09\u540D\u5C08\u5C6C\u9A57\u8B49\u78BC\u5DF2\u9EDE\u5C0D\u9EDE\u50B3\u9001\u81F3\u5B78\u751F\u624B\u6A5F"), /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 360,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "sec-title",
      style: {
        marginBottom: 10
      }
    }, "\u5B8C\u6574\u6392\u884C\u699C"), /*#__PURE__*/React.createElement(Leaderboard, {
      players: _leaderboard
    })));
  }
  if (gameStatus === 'lobby') {
    return /*#__PURE__*/React.createElement("div", {
      className: "setup"
    }, /*#__PURE__*/React.createElement("div", {
      className: "setup-title"
    }, "\u6EAB\u5BA4\u6C23\u9AD4\u76E4\u67E5\u6436\u7B54\u7CFB\u7D71"), /*#__PURE__*/React.createElement("div", {
      className: "setup-sub"
    }, "\u8001\u5E2B\u63A7\u5236\u53F0 \xB7 \u7B49\u5F85\u5B78\u751F\u52A0\u5165"), /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "info-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "info-lbl"
    }, "\u5DF2\u52A0\u5165\u73A9\u5BB6"), /*#__PURE__*/React.createElement("span", {
      className: "info-val"
    }, players.length, " \u4EBA")), /*#__PURE__*/React.createElement("div", {
      className: "player-chips"
    }, players.map(function (p) {
      return /*#__PURE__*/React.createElement("span", {
        key: p.id,
        className: "chip"
      }, p.name);
    }), players.length === 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--muted)'
      }
    }, "\u7B49\u5F85\u5B78\u751F\u6383\u78BC\u52A0\u5165..."))), /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "info-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "info-lbl"
    }, "\u984C\u76EE\u6578\u91CF"), /*#__PURE__*/React.createElement("span", {
      className: "info-val"
    }, "10 \u984C\uFF08\u53EF\u64F4\u5145\u81F3 156 \u984C\uFF09")), /*#__PURE__*/React.createElement("div", {
      className: "info-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "info-lbl"
    }, "\u6BCF\u984C\u6642\u9650"), /*#__PURE__*/React.createElement("span", {
      className: "info-val"
    }, "15 \u79D2")), /*#__PURE__*/React.createElement("div", {
      className: "info-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "info-lbl"
    }, "\u8A08\u5206\u65B9\u5F0F"), /*#__PURE__*/React.createElement("span", {
      className: "info-val"
    }, "\u7B54\u5C0D +10 \u5206\uFF0C\u901F\u5EA6\u52A0\u6210\u6700\u9AD8 +7 \u5206"))), err && /*#__PURE__*/React.createElement("div", {
      className: "err-msg"
    }, err), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-green",
      style: {
        width: '100%',
        padding: 14,
        fontSize: 15,
        borderRadius: 12
      },
      onClick: function onClick() {
        return socket.emit('host:startGame');
      },
      disabled: players.length === 0
    }, "\u25B6 \u958B\u59CB\u904A\u6232"), players.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        fontSize: 12,
        color: 'var(--muted)',
        marginTop: 8
      }
    }, "\u81F3\u5C11\u9700\u8981\u4E00\u540D\u5B78\u751F\u52A0\u5165\u624D\u80FD\u958B\u59CB"));
  }
  var answeredCount = players.filter(function (p) {
    return p.answered;
  }).length;
  var dist = (revealData === null || revealData === void 0 ? void 0 : revealData.distribution) || {
    A: 0,
    B: 0,
    C: 0,
    D: 0
  };
  var totalDist = Object.values(dist).reduce(function (a, b) {
    return a + b;
  }, 0);
  var leaderboard = (revealData === null || revealData === void 0 ? void 0 : revealData.leaderboard) || players;
  return /*#__PURE__*/React.createElement("div", {
    className: "host"
  }, /*#__PURE__*/React.createElement("div", {
    className: "host-main"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Space Grotesk',sans-serif",
      fontSize: 18,
      fontWeight: 700,
      color: 'var(--green)'
    }
  }, "\uD83C\uDF0D \u6EAB\u5BA4\u6C23\u9AD4\u76E4\u67E5\u6436\u7B54")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "pulse"
  }), answeredCount, "/", players.length, " \u4EBA\u5DF2\u4F5C\u7B54")), question && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "q-badge"
  }, "\u7B2C ", question.index + 1, " \u984C"), /*#__PURE__*/React.createElement("div", {
    className: "q-prog-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "q-prog",
    style: {
      width: "".concat((question.index + 1) / question.total * 100, "%")
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "q-count"
  }, question.index + 1, "/", question.total)), /*#__PURE__*/React.createElement("div", {
    className: "q-text"
  }, question.question), /*#__PURE__*/React.createElement("div", {
    className: "opts"
  }, ['A', 'B', 'C', 'D'].map(function (opt) {
    return /*#__PURE__*/React.createElement("div", {
      key: opt,
      className: "opt ".concat(revealData ? opt === revealData.correctAnswer ? 'correct' : 'wrong' : 'neutral')
    }, /*#__PURE__*/React.createElement("div", {
      className: "opt-lbl"
    }, opt), /*#__PURE__*/React.createElement("div", {
      className: "opt-txt"
    }, question.options[opt]));
  })), gameStatus === 'question' && /*#__PURE__*/React.createElement(TimerRing, {
    sec: timeLeft,
    total: TIMER_TOTAL
  })), revealData && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sec-title"
  }, "\u4F5C\u7B54\u5206\u5E03"), ['A', 'B', 'C', 'D'].map(function (opt) {
    return /*#__PURE__*/React.createElement("div", {
      key: opt,
      className: "dist-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dist-lbl",
      style: {
        color: opt === revealData.correctAnswer ? 'var(--green)' : undefined
      }
    }, opt), /*#__PURE__*/React.createElement("div", {
      className: "dist-bg"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dist-fill",
      style: {
        width: "".concat(totalDist ? (dist[opt] || 0) / totalDist * 100 : 0, "%"),
        background: opt === revealData.correctAnswer ? 'var(--green)' : '#da3633'
      }
    })), /*#__PURE__*/React.createElement("span", {
      className: "dist-n"
    }, dist[opt] || 0));
  })), /*#__PURE__*/React.createElement("div", {
    className: "ctrls"
  }, gameStatus === 'question' && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline",
    onClick: function onClick() {
      return socket.emit('host:revealAnswer');
    }
  }, "\uD83D\uDCCA \u516C\u5E03\u7B54\u6848"), gameStatus === 'revealing' && !(revealData !== null && revealData !== void 0 && revealData.isLastQuestion) && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-green",
    onClick: function onClick() {
      return socket.emit('host:nextQuestion');
    }
  }, "\u4E0B\u4E00\u984C \u2192"), gameStatus === 'revealing' && (revealData === null || revealData === void 0 ? void 0 : revealData.isLastQuestion) && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-green",
    onClick: function onClick() {
      return socket.emit('host:endGame');
    }
  }, "\u7D50\u7B97\u6210\u7E3E \uD83C\uDFC6"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-red",
    onClick: function onClick() {
      return socket.emit('host:endGame');
    }
  }, "\u7D50\u675F\u904A\u6232"))), /*#__PURE__*/React.createElement("div", {
    className: "host-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-val"
  }, players.length), /*#__PURE__*/React.createElement("div", {
    className: "stat-lbl"
  }, "\u53C3\u8207\u4EBA\u6578")), /*#__PURE__*/React.createElement("div", {
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-val"
  }, answeredCount), /*#__PURE__*/React.createElement("div", {
    className: "stat-lbl"
  }, "\u5DF2\u4F5C\u7B54"))), /*#__PURE__*/React.createElement("div", {
    className: "sec-title"
  }, "\u5373\u6642\u6392\u884C\u699C"), /*#__PURE__*/React.createElement(Leaderboard, {
    players: leaderboard
  })));
}

// ══════════════════════════════════════════
// PLAYER VIEW
// ══════════════════════════════════════════
function PlayerView() {
  var _useState13 = useState('join'),
    _useState14 = _slicedToArray(_useState13, 2),
    phase = _useState14[0],
    setPhase = _useState14[1]; // join|waiting|question|result|gameover
  var _useState15 = useState(''),
    _useState16 = _slicedToArray(_useState15, 2),
    name = _useState16[0],
    setName = _useState16[1];
  var _useState17 = useState(null),
    _useState18 = _slicedToArray(_useState17, 2),
    question = _useState18[0],
    setQuestion = _useState18[1];
  var _useState19 = useState(null),
    _useState20 = _slicedToArray(_useState19, 2),
    selected = _useState20[0],
    setSelected = _useState20[1];
  var _useState21 = useState(null),
    _useState22 = _slicedToArray(_useState21, 2),
    answerResult = _useState22[0],
    setAnswerResult = _useState22[1];
  var _useState23 = useState(TIMER_TOTAL),
    _useState24 = _slicedToArray(_useState23, 2),
    timeLeft = _useState24[0],
    setTimeLeft = _useState24[1];
  var _useState25 = useState(0),
    _useState26 = _slicedToArray(_useState25, 2),
    totalScore = _useState26[0],
    setTotalScore = _useState26[1];
  var _useState27 = useState(null),
    _useState28 = _slicedToArray(_useState27, 2),
    gameOver = _useState28[0],
    setGameOver = _useState28[1];
  var _useState29 = useState(''),
    _useState30 = _slicedToArray(_useState29, 2),
    err = _useState30[0],
    setErr = _useState30[1];
  var timerRef = useRef(null);
  var qrRef = useRef(null);
  useEffect(function () {
    if (phase === 'join' && qrRef.current) {
      var url = window.location.origin;
      QRCode.toCanvas(qrRef.current, url, {
        width: 160,
        margin: 1,
        color: {
          dark: '#e6edf3',
          light: '#161b22'
        }
      }, function () {});
    }
  }, [phase]);
  useEffect(function () {
    socket.on('player:joined', function () {
      return setPhase('waiting');
    });
    socket.on('player:question', function (q) {
      setQuestion(q);
      setPhase('question');
      setSelected(null);
      setAnswerResult(null);
      setTimeLeft(q.timer);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(function () {
        return setTimeLeft(function (t) {
          if (t <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    });
    socket.on('player:answerResult', function (r) {
      setAnswerResult(r);
      setTotalScore(r.totalScore);
      clearInterval(timerRef.current);
    });
    socket.on('player:reveal', function () {});
    socket.on('player:gameOver', function (d) {
      setGameOver(d);
      setPhase('gameover');
      clearInterval(timerRef.current);
    });
    socket.on('connect_error', function () {
      return setErr('無法連接伺服器，請確認網路與伺服器狀態');
    });
    return function () {
      clearInterval(timerRef.current);
      ['player:joined', 'player:question', 'player:answerResult', 'player:reveal', 'player:gameOver', 'connect_error'].forEach(function (e) {
        return socket.off(e);
      });
    };
  }, []);
  var join = function join() {
    if (!name.trim()) return;
    setErr('');
    socket.emit('player:join', {
      name: name.trim()
    });
  };
  var answer = function answer(choice) {
    if (selected || answerResult) return;
    setSelected(choice);
    socket.emit('player:answer', {
      choice: choice
    });
  };
  var timerPct = timeLeft / TIMER_TOTAL * 100;
  var timerCls = timeLeft <= 5 ? 'danger' : timeLeft <= 8 ? 'warn' : '';

  // ── JOIN
  if (phase === 'join') return /*#__PURE__*/React.createElement("div", {
    className: "player"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-logo"
  }, "\uD83C\uDF0D GHG Quiz"), /*#__PURE__*/React.createElement("div", {
    className: "p-sub"
  }, "\u6EAB\u5BA4\u6C23\u9AD4\u76E4\u67E5\u898F\u5283\u5E2B \u6436\u7B54\u904A\u6232"), /*#__PURE__*/React.createElement("div", {
    className: "join-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "join-title"
  }, "\u52A0\u5165\u904A\u6232"), /*#__PURE__*/React.createElement("div", {
    className: "join-desc"
  }, "\u8F38\u5165\u66B1\u7A31\u5F8C\u9EDE\u64CA\u52A0\u5165\uFF0C\u7B49\u5F85\u8001\u5E2B\u958B\u59CB\u904A\u6232"), /*#__PURE__*/React.createElement("input", {
    className: "nick-input",
    placeholder: "\u8F38\u5165\u4F60\u7684\u66B1\u7A31",
    value: name,
    onChange: function onChange(e) {
      return setName(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      return e.key === 'Enter' && join();
    }
  }), err && /*#__PURE__*/React.createElement("div", {
    className: "err-msg"
  }, err), /*#__PURE__*/React.createElement("button", {
    className: "btn-join",
    onClick: join,
    disabled: !name.trim()
  }, "\u52A0\u5165\u904A\u6232 \uD83D\uDE80"), /*#__PURE__*/React.createElement("div", {
    className: "qr-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qr-lbl"
  }, "\u5206\u4EAB\u7D66\u540C\u5B78\u6383\u78BC\u52A0\u5165"), /*#__PURE__*/React.createElement("canvas", {
    ref: qrRef,
    style: {
      borderRadius: 6,
      display: 'block',
      margin: '0 auto'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "qr-url"
  }, typeof window !== 'undefined' ? window.location.origin : ''))));

  // ── WAITING
  if (phase === 'waiting') return /*#__PURE__*/React.createElement("div", {
    className: "player"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-waiting"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-icon"
  }, "\u23F3"), /*#__PURE__*/React.createElement("div", {
    className: "p-badge"
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 700
    }
  }, "\u7B49\u5F85\u8001\u5E2B\u958B\u59CB\u904A\u6232"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--muted)',
      lineHeight: 1.6
    }
  }, "\u52A0\u5165\u6210\u529F\uFF01", /*#__PURE__*/React.createElement("br", null), "\u8ACB\u6E96\u5099\u597D\u6436\u7B54")));

  // ── GAME OVER
  if (phase === 'gameover' && gameOver) return /*#__PURE__*/React.createElement("div", {
    className: "player"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-gameover"
  }, gameOver.isWinner ? /*#__PURE__*/React.createElement("div", {
    className: "winner-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-emoji"
  }, "\uD83C\uDF89"), /*#__PURE__*/React.createElement("div", {
    className: "w-title"
  }, "\u606D\u559C\u7372\u5F97\u7B2C ", gameOver.rank, " \u540D\uFF01"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'rgba(255,255,255,.6)',
      marginBottom: 16
    }
  }, "\u6700\u7D42\u5F97\u5206\uFF1A", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--green)',
      fontWeight: 700,
      fontSize: 18
    }
  }, gameOver.score, " \u5206")), /*#__PURE__*/React.createElement("div", {
    className: "w-code-lbl"
  }, "\u8ACB\u6191\u6B64\u5C08\u5C6C\u9A57\u8B49\u78BC\u81F3\u53F0\u524D\u9818\u53D6\u734E\u52F5"), /*#__PURE__*/React.createElement("div", {
    className: "w-code"
  }, gameOver.code)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 56
    }
  }, "\uD83C\uDF31"), /*#__PURE__*/React.createElement("div", {
    className: "normal-end"
  }, "\u904A\u6232\u7D50\u675F"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, "\u611F\u8B1D\u53C3\u8207\uFF01"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Space Grotesk',sans-serif",
      fontSize: 36,
      fontWeight: 700,
      color: 'var(--green)'
    }
  }, gameOver.score, " \u5206"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--muted)'
    }
  }, "\u7B2C ", gameOver.rank, " \u540D"))));

  // ── QUESTION
  return /*#__PURE__*/React.createElement("div", {
    className: "player"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-badge"
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Space Grotesk',sans-serif",
      fontSize: 18,
      fontWeight: 700,
      color: 'var(--green)'
    }
  }, totalScore, " \u5206")), question && /*#__PURE__*/React.createElement("div", {
    className: "p-q-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-q-meta"
  }, "\u7B2C ", question.index + 1, " \u984C / ", question.total), /*#__PURE__*/React.createElement("div", {
    className: "p-q-text"
  }, question.question)), /*#__PURE__*/React.createElement("div", {
    className: "p-timer-num",
    style: {
      color: timerCls === 'danger' ? 'var(--red)' : timerCls === 'warn' ? 'var(--yellow)' : 'var(--green)'
    }
  }, timeLeft), /*#__PURE__*/React.createElement("div", {
    className: "p-timer-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-timer-fill ".concat(timerCls),
    style: {
      width: "".concat(timerPct, "%")
    }
  })), answerResult ? /*#__PURE__*/React.createElement("div", {
    className: "res-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "res-ico"
  }, answerResult.correct ? '✅' : '❌'), /*#__PURE__*/React.createElement("div", {
    className: "res-title"
  }, answerResult.correct ? '答對了！' : '答錯了...'), answerResult.correct && /*#__PURE__*/React.createElement("div", {
    className: "res-score"
  }, "+", answerResult.earned), /*#__PURE__*/React.createElement("div", {
    className: "res-sub"
  }, "\u6B63\u78BA\u7B54\u6848\uFF1A", answerResult.correctAnswer, " \u2014 ", question === null || question === void 0 ? void 0 : question.options[answerResult.correctAnswer])) : /*#__PURE__*/React.createElement("div", {
    className: "ans-grid"
  }, ['A', 'B', 'C', 'D'].map(function (opt) {
    return /*#__PURE__*/React.createElement("button", {
      key: opt,
      className: "ans-btn ".concat(opt, " ").concat(selected === opt ? 'sel' : ''),
      onClick: function onClick() {
        return answer(opt);
      },
      disabled: !!selected
    }, opt);
  })));
}

// ══════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════
function App() {
  // 根據路徑決定預設 tab
  var defaultTab = window.location.pathname === '/host' ? 'host' : 'player';
  var _useState31 = useState(defaultTab),
    _useState32 = _slicedToArray(_useState31, 2),
    tab = _useState32[0],
    setTab = _useState32[1];
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(tab === 'host' ? 'active' : ''),
    onClick: function onClick() {
      return setTab('host');
    }
  }, "\uD83D\uDDA5 \u4E3B\u6A5F\u7AEF\uFF08\u8001\u5E2B\uFF09"), /*#__PURE__*/React.createElement("div", {
    className: "tab ".concat(tab === 'player' ? 'active' : ''),
    onClick: function onClick() {
      return setTab('player');
    }
  }, "\uD83D\uDCF1 \u73A9\u5BB6\u7AEF\uFF08\u5B78\u751F\uFF09")), /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, tab === 'host' ? /*#__PURE__*/React.createElement(HostView, null) : /*#__PURE__*/React.createElement(PlayerView, null)));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
