module Main (main) where
import Data.Unique
import Data.List
import System.Environment
import Control.Monad (when)
import System.IO

type Arity = Int
type ID = Int
type Value = Int
type Name = String
type Connected = Bool
type Target = Agent
type Source = Agent
type SourceP = Int
type TargetP = Int

data Agent = Agent Arity Value Name Portlist ID

            
-- a list of free ports for an agent
data Portlist = Portlist [Int]
-- changes two agents connected by their principle ports to an RNet (INet w/o rules)
data Rule = Rule Agent Agent RNet
-- first agent is originator, 2nd is target
data Connection = Active Source Target SourceP TargetP
                | Passive Source Target SourceP TargetP
                | Full String

-- INET datastructure which is 4 lists of: agents, rules, active connections and passive connections
data INet = INet [Agent] [Rule] [Connection] [Connection]
-- RNET datastructure which is for showing the resultant sub-net caused by an interaction
data RNet = RNet [Agent] [Connection] [Connection] Freeport
-- free ports which show which new agent the free port links to once a reduction occurs, where source is the original agent that a connection
-- would have linked to, and target is the new agent that it would link to
data Freeport = Freeport [(Source, SourceP)] [(Target, TargetP)]

instance Show Agent where
    show = showAgent             
instance Show Rule where
    show = showRule
instance Show Portlist where
    show = showPortlist
instance Show Connection where
    show = showCon
instance Show INet where
    show = showNet
instance Show RNet where
    show = showRNet

-- defining equalities
instance Eq Agent where
    (Agent _ _ s1 _ n1) == (Agent _ _ s2 _ n2) = (s1 == s2) && (n1 == n2)
instance Eq Rule where
    (Rule a1 a2 a3) == (Rule a4 a5 a6) = (weakEq a1 a4) && (weakEq a2 a5) && (a3 == a6)
instance Eq RNet where
    (RNet a1 ac1 pc1 fp1) == (RNet a2 ac2 pc2 fp2) = (listCheckWeakEq a1 a2) && (ac1 == ac2) && (pc1 == pc2) && (fp1 == fp2)
instance Eq Connection where
    (Active s1 t1 sp1 tp1) == (Active s2 t2 sp2 tp2) = (weakEq s1 s2) && (weakEq t1 t2) && (sp1 == sp2) && (tp1 == tp2)
    (Passive s1 t1 sp1 tp1) == (Active s2 t2 sp2 tp2) = (weakEq s1 s2) && (weakEq t1 t2) && (sp1 == sp2) && (tp1 == tp2)
instance Eq Freeport where
    (Freeport [] []) == (Freeport [] []) = True
    (Freeport ((s1,sp1):(ss1)) ((t1,tp1):(ts1))) == (Freeport ((s2,sp2):(ss2)) ((t2,tp2):(ts2)))    | (s1==s2) && (sp1 == sp2) && (t1 == t2) && (tp1 == tp2) = (Freeport ss1 ts1) == (Freeport ss2 ts2)
                                                                                                    | otherwise = False

showAgent :: Agent -> String
showAgent (Agent arity value name portlist id) = "Agent Name: " ++ show name ++ " of ID# " ++ show id ++ " Arity: (" ++ show arity ++ ") ID of free ports: " ++ show portlist ++ "\n"

showRule :: Rule -> String
showRule (Rule (Agent t1 v1 id1 portlist1 num1) (Agent t2 v2 id2 portlist2 num2) rnet) = "(Agent 1 Name: " ++ show id1 ++  ") (Agent 2 Name: " ++ show id2 ++ ") ----> (Result Net : " ++ show rnet ++ ")\n"

showRuleSmall :: Rule -> String
showRuleSmall (Rule (Agent _ _ nam1 _ id1) (Agent _ _ nam2 _ id2) _) = "Agents " ++ show nam1 ++ " & " ++ show nam2 ++ " have a rule"

showRuleSmall' :: [Rule] -> String
showRuleSmall' [] = []
showRuleSmall' (r:rs) = showRuleSmall r ++ "\n" ++ showRuleSmall' rs

showPortlist :: Portlist -> String
showPortlist (Portlist []) = ""
showPortlist (Portlist (p:ps)) = show p ++ showPortlist (Portlist ps)

showCon :: Connection -> String
showCon (Passive (Agent _ _ id1 _ num1) (Agent _ _ id2 _ num2) s t) = "Agent: " ++ show id1 ++ " of ID#: " ++ show num1 ++ " connected through port#: " ++  show s ++ " to Agent: " ++ show id2 ++ " of ID#: " ++ show num2 ++ " through target port#: " ++ show t ++ "\n"
showCon (Active (Agent _ _ id1 _ num1) (Agent _ _ id2 _ num2) _ _) = "Agent: " ++ show id1 ++ " of ID#: " ++ show num1 ++ " connected to agent: " ++ show id2 ++ " of ID#: " ++ show num2 ++ " via their principle ports (#0)\n"
showCon (Full s) = "Empty connection due to : " ++ s ++ "\n"

showRNet :: RNet -> String
showRNet (RNet a c1 c2 _) = "___Net___\n__Agents__\n " ++ show a  ++ "\n__Active connections__\n " ++ show c1 ++ "\n__Passive connections__\n " ++ show c2

showNet :: INet -> String
showNet (INet a r c1 c2) = "___Net___\n__Agents__\n " ++ show a ++ "\n__Rules__\n " ++ showRuleSmall' r ++ "\n__Active connections__\n " ++ show c1 ++ "\n__Passive connections__\n " ++ show c2

succ0 :: Agent
succ0 = createAgent 0 0 "S"
succ1 :: Agent
succ1 = createAgent 0 0 "S"
addition :: Agent
addition = createAgent 2 0 "+"
multi :: Agent
multi = Agent 2 0 "Mult" (Portlist []) 3
erase :: Agent
erase = Agent 0 0 "Erase" (Portlist []) 4
erase1 :: Agent
erase1 = Agent 0 0 "Erase" (Portlist [0]) 5
duplicator :: Agent
duplicator = Agent 2 0 "Dupl" (Portlist [1,2]) 6
erase0 :: Agent
erase0 = Agent 0 0 "Erase" (Portlist [0]) 7
zero0 :: Agent
zero0 = Agent 0 0 "0" (Portlist []) 8
zero1 :: Agent
zero1 = Agent 0 0 "0" (Portlist []) 9
xag :: Agent
xag = Agent 3 0 "x" (Portlist [0,2]) 10
yag :: Agent
yag = Agent 5 0 "y" (Portlist [1,2,3,4]) 11
zeromult :: Connection
zeromult = Active zero0 multi 0 0
xmult :: Connection
xmult = Passive xag multi 1 2
ymult :: Connection
ymult = Passive yag multi 0 1
erasey :: Connection
erasey = Active yag erase0 0 0
xzero :: Connection
xzero = Passive xag zero0 1 0
erasedup :: Connection
erasedup = Active duplicator erase 0 0
rNet1 :: RNet
rNet1 = RNet [zero0, erase] [] [] (Freeport [(multi, 1), (multi, 2)] [(erase, 0), (zero0, 0)])
rNDE :: RNet
rNDE = RNet [erase0, erase1] [] [] (Freeport [(duplicator, 1), (duplicator, 2)] [(erase0, 0), (erase1, 0)])
rDE :: Rule
rDE = Rule duplicator erase rNDE
rule1 :: Rule
rule1 = Rule zero0 multi rNet1
exfree :: Freeport
exfree = Freeport [(duplicator, 1), (duplicator, 2)] [(erase0, 0), (erase1, 0)]

demo :: INet
demo = INet [zero0, multi, yag, xag] [rule1] [zeromult] [xmult, ymult] 
demo2 :: INet
demo2 = INet [erase, duplicator] [rDE] [erasedup] []
 

createAgent :: Int -> Value -> String -> Agent
createAgent arity value name  = Agent arity value name p 0
    where p = portInit arity

portInit :: Int -> Portlist
portInit x = Portlist [0..x]

removePort :: Agent -> Int -> Agent
removePort (Agent x y z (Portlist p) n) i = Agent x y z (Portlist (delete i p)) n

-- check if port is free
portCheck :: Agent -> Int -> Bool
portCheck (Agent _ _ _ p _) i = portCheck' p i

portCheck' :: Portlist -> Int -> Bool
portCheck' ((Portlist [])) i = False
portCheck' ((Portlist (p:ps))) i | p == i = True
                                 | otherwise = portCheck' (Portlist ps) i

-- return the port# of an empty port (non principle)
emptyNP :: Agent -> Int
emptyNP (Agent _ _ _ (Portlist (p:ps)) _) | p == 0 = if (not (ps == [])) then (head ps) else 0
                                                      | not (p == 0) = p
                                                      | otherwise = 0

-- create a connection between two agents, with bools representing whether to use principle port or not
createLink :: Agent -> Bool -> Agent -> Bool -> (Connection, (Agent, Agent))
createLink a1 b1 a2 b2 | (b1 && b2)                     = if (portCheck a1 0 && portCheck a2 0) then ((Active a1 a2 0 0), ((removePort a1 0), (removePort a2 0))) else ((Full "PrinFull"),(a1,a2)) 
                       | (b1)                           = if (portCheck a1 0 ) && not (i == 0) then ((Passive a1 a2 0 i), ((removePort a1 0), (removePort a2 i))) else ((Full "source principle full or a2 non-principle full"),(a1,a2))
                       | b2                             = if (portCheck a2 0) && not (j == 0) then  ((Passive a1 a2 j 0), ((removePort a1 j), (removePort a2 0))) else ((Full "target principle full or source non-principle full"),(a1,a2))
                       | (not (i==0)) && (not (j==0))   = ((Passive a1 a2 j i), (removePort a1 j, removePort a2 i))
                       | otherwise                      = ((Full "One agent has full ports"), (a1,a2))
                            where 
                                i = emptyNP a2 
                                j = emptyNP a1

--whether a connection is a valid reduction via specified rule
validReduction :: Connection -> Rule -> Bool
validReduction (Active a1 a2 _ _) (Rule a3 a4 rnet) | (weakEq a1 a3) && (weakEq a2 a4) = True
                                                    | (weakEq a2 a3) && (weakEq a1 a4) = True
                                                    | otherwise = False
validReduction (Passive _ _ _ _) r = False
validReduction (Full _) r = False

--whether a connection list has a valid reduction on the specified rule
validReductionList :: [Connection] -> Rule -> Bool
validReductionList [] r = False
validReductionList (c:cs) r | validReduction c r = True
                            | otherwise = validReductionList cs r

-- check for agents of same name, in order to give different IDS
weakEq :: Agent -> Agent -> Bool
weakEq (Agent _ _ n1 _ _) (Agent _ _ n2 _ _) | n1 == n2     = True
                                             | otherwise    = False

listElem :: Agent -> [Agent] -> Bool
listElem a [] = False
listElem x (y:ys)   | x == y = True
                    | otherwise = listElem x ys

listRem :: Agent -> [Agent] -> [Agent]
listRem _ [] = []
listRem x (y:ys)    | x == y = ys
                    | otherwise = [y] ++ listRem x ys

listCheckWeakEq :: [Agent] -> [Agent] -> Bool
listCheckWeakEq [] []       = True
listCheckWeakEq (x:xs) y    | listContWeakEq x y = listCheckWeakEq xs (listRemoveWeakEq x y)
                            | otherwise = False

listContWeakEq :: Agent -> [Agent] -> Bool
listContWeakEq x []         = False
listContWeakEq x (y:ys)     | weakEq x y = True
                            | otherwise = listContWeakEq x ys

listRemoveWeakEq :: Agent -> [Agent] -> [Agent]
listRemoveWeakEq x (y:ys)    | weakEq x y = ys
                             | otherwise = [y] ++ listRemoveWeakEq x ys

-- check for highest occurence of ID in list to set as one higher
highestNum :: [Agent] -> Agent -> Int
highestNum [] _                             = 0
highestNum (a:as) agent | weakEq a agent    = 1 + highestNum as agent
                        | otherwise         = highestNum as agent

--update agent list to remove the two original agents and add the new agent - checking that new agent is not a copy of an existing agent and increasing its ID if it is
updateAgentList :: [Agent] -> Rule -> [Agent]
updateAgentList [] _ = []
updateAgentList agents (Rule a1 a2 (RNet x ac pc freeport)) =  x ++ (updateAgentList' (updateAgentList' agents a1) a2)

-- remove agent from list
updateAgentList' :: [Agent] -> Agent -> [Agent]
updateAgentList' [] a1  = []
updateAgentList' (a:agents) a1  |  weakEq a a1 = agents
                                |  otherwise   = [a] ++ (updateAgentList' agents a1)

updateAgentID :: [Agent] -> [Agent]
updateAgentID [] = []
updateAgentID ((Agent arity value name portlist id):as) | listElem a as = [(Agent arity value name portlist (highestNum as a))] ++ listRem a as
                                                        | otherwise     = [a] ++ updateAgentID as
                                                            where
                                                                a = (Agent arity value name portlist id)

--update connection list to reflect agent changes 
updateConnectionList :: [Connection] -> Rule -> [Connection]
updateConnectionList [] _ = []
updateConnectionList ((Active source target sp tp):cs) (Rule a1 a2 (RNet as acs pcs freeport))  | (source == a1) && (target == a2)  = acs ++ updateConnectionList cs r
                                                                                                | (source == a2) && (target == a1)  = acs ++ updateConnectionList cs r
                                                                                                | otherwise                         = [ca] ++ updateConnectionList cs r
                                                                                                    where 
                                                                                                        r   = (Rule a1 a2 (RNet as acs pcs freeport))
                                                                                                        ca  = (Active source target sp tp)
updateConnectionList ((Passive source target sp tp):cs) (Rule a1 a2 (RNet as acs pcs freeport))     | (source == a1) = [(Passive (fst a1sp) target (snd a1sp) tp)] ++ updateConnectionList cs r
                                                                                                    | (target == a1) = [(Passive source (fst a1tp) sp (snd a1tp))] ++ updateConnectionList cs r
                                                                                                    | (source == a2) = [(Passive (fst a2sp) target (snd a2sp) tp)] ++ updateConnectionList cs r
                                                                                                    | (target == a2) = [(Passive source (fst a2tp) sp (snd a2tp))] ++ updateConnectionList cs r
                                                                                                    | otherwise      = [cp] ++ updateConnectionList cs r
                                                                                                        where 
                                                                                                            r   = (Rule a1 a2 (RNet as acs pcs freeport))
                                                                                                            cp  = (Passive source target sp tp)
                                                                                                            a1tp = newPassiveLink a1 freeport tp
                                                                                                            a1sp = newPassiveLink a1 freeport sp
                                                                                                            a2tp = newPassiveLink a2 freeport tp
                                                                                                            a2sp = newPassiveLink a2 freeport sp

--finds the new source or target for a wire after undergoing a reduction
newPassiveLink :: Agent -> Freeport -> Int -> (Agent, Int)
newPassiveLink a (Freeport [] []) i = (a,i)
newPassiveLink a (Freeport (x:xs) (y:ys)) i  | (a,i) == x = y
                                             | otherwise = newPassiveLink a (Freeport xs ys) i

--update net after reduction occurs
reduceNetByRule :: INet -> Rule -> INet
reduceNetByRule (INet a r ac pc ) rule  | validReductionList ac rule    = (INet (updateAgentID (updateAgentList a rule)) r (updateConnectionList ac rule) (updateConnectionList pc rule))
                                        | otherwise                     = (INet a r ac pc)

-- add agent to a net, checking for weakeq agents and iterating their ID values
addAgent :: INet -> Agent -> INet
addAgent (INet as r ac pc) (Agent arity value name portlist num) = INet ([a] ++ as) r ac pc
                                                                    where
                                                                        a   = (Agent arity value name portlist (highestNum as ogA))
                                                                        ogA = (Agent arity value name portlist num)

-- check if rule uses same 2 agents, in either direction
ruleClash :: Rule -> Rule -> Bool
ruleClash (Rule a1 a2 a3) (Rule a4 a5 a6)   | (weakEq a1 a4) && (weakEq a2 a5)  = True
                                            | (weakEq a1 a5) && (weakEq a2 a4)  = True
                                            | otherwise                         = False

--check if rule clashes with one already in list (i.e. if it connects the same 2 agents) - each 2 agents may only have 1 rule
ruleCheck :: [Rule] -> Rule -> Bool
ruleCheck [] rule                           = True
ruleCheck (r:rs) rule   | ruleClash r rule  = False
                        | otherwise         = ruleCheck rs rule

-- add a rule to the net, checking the rule is valid first
addRule :: INet -> Rule -> INet 
addRule (INet as rs ac pc) r    | ruleCheck rs r    = (INet as ([r] ++ rs) ac pc)
                                | otherwise         = (INet as rs ac pc)

addConnection :: INet -> Connection -> INet
addConnection (INet as rs ac pc) (Active source target sp tp) = INet as rs ([(Active source target sp tp)] ++ ac) pc
addConnection (INet as rs ac pc) (Passive source target sp tp) = INet as rs ac ([(Passive source target sp tp)] ++ pc)

--if there is a reduction, perform it, otherwise return original net
reduce :: INet -> INet
reduce (INet a [] ac pc)  = (INet a [] ac pc)
reduce (INet a (r:rs) ac pc)    | validReductionList ac r   = reduceNetByRule inet r
                                | otherwise                 = addRule (reduce (INet a rs ac pc)) r
                                            where 
                                                inet = (INet a (r:rs) ac pc)

--FUNCTIONS BELOW THIS POINT FOR PARSING INFO TO/FROM FRONTEND
-- RULES FOR PARSING : 
--":" splits between agent, rule and connection lists
--")" splits between agents in their lists
--"!" splits between connections in their lists
-- "*" splits between rules in their lists
--"." splits between parts of agents (i.e. arity,name,id,portlist)
--"[]" denote start and end of RNET
--"~" splits between parts of a rule
--"(" splits between parts of a connection
--"-" splits between agent and connection list in an RNET
--"|" splits between each part of a freeport
--"$" splits between different freeports

data CList = CList [Connection] [Connection]
data Fronts = Fronts [(Agent, Int)]
data Front = Front (Agent, Int)
data Backs = Backs [(Agent, Int)]
data Back = Back (Agent, Int)
--splits string at ':' for agents, rules and connections to be separated
readNet :: String -> INet
readNet s      = INet (readAgents (lists !! 0)) (readRules (lists !! 1)) ac pc
   where 
            lists = (splitOn s ':' [])
            clist = (readCons (lists !! 2))
            (CList ac pc) = clist

--splits string at ")" to seperate different Agents
readAgents :: String -> [Agent]
readAgents []    = []
readAgents (as)  = [readAgent l] ++ (readAgents'  ls)
    where (l:ls) = (splitOn as ')' [])

readAgents' :: [String] -> [Agent]
readAgents' []     = []
readAgents' (a:as) = [readAgent a] ++ (readAgents' as)

--splits string at '.' to separate different attributes of agents
readAgent :: String -> Agent
readAgent as   = (Agent (read (list!!0)) 0 (list!!1) (readPortlist (list!!2)) (read (list!!3)) )
    where list = splitOn as '.' []

readPortlist :: String -> Portlist
readPortlist [] = Portlist []
readPortlist p  = Portlist (readIntArray p)

readIntArray :: String -> [Int]
readIntArray [] = []
readIntArray i  = map read list
    where list  = (splitOn (delete ']' (delete '[' i)) ',' [])

readRules :: String -> [Rule]
readRules [] = []
readRules s  = readRules' list
    where list = splitOn s '*' []

readRules' :: [String] -> [Rule]
readRules' []     = []
readRules' (r:rs) = [readRule r] ++ (readRules' rs)

readRule :: String -> Rule
readRule s      = Rule (readAgent (comps !! 0)) (readAgent (comps !! 1)) (readRNet (comps !! 2))
    where comps = splitOn s '~' []

readRNet :: String -> RNet
readRNet s = RNet (readAgents (lists !! 0)) (ac) (pc) (readFreeports (lists !! 2))
    where 
        lists = splitOn s '-' []
        clist = (readCons (lists !! 1))
        (CList ac pc) = clist



readFreeports :: String -> Freeport
readFreeports [] = Freeport [] []
readFreeports s  = readFreeports' list
   where list    = splitOn s '$' []

readFreeports' :: [String] -> Freeport
readFreeports' f  = Freeport f1 b1
    where
        Fronts f1 = processfronts f
        Backs b1  = processbacks  f

-- splits freeports into 'fronts' and 'backs' which are lists of agents and ports (where fronts connect to backs)
processfronts :: [String] -> Fronts
processfronts [] = Fronts []
processfronts (f:fs) = Fronts ([(f1, f2)] ++ f3)
    where
        Front (f1,f2) = processfront f
        Fronts f3 = processfronts fs

processfront :: String -> Front
processfront s  = Front ((readAgent (split !! 0)), (read (split !! 1)))
    where split = splitOn s '|' []

processbacks :: [String] -> Backs
processbacks [] = Backs []
processbacks (f:fs) = Backs ([(b1, b2)] ++ b3)
    where
        Back (b1, b2) = processback f
        Backs b3 = processbacks fs

processback :: String -> Back
processback s  = Back ((readAgent (split !! 2)), (read (split !! 3)))
    where split = splitOn s '|' []
 
 --read connections from input string
readCons :: String -> CList
readCons []   = CList [] []
readCons s    =  readCons' cons [] []
   where cons = (splitOn s '!' [])

readCons' :: [String] -> [Connection] -> [Connection] -> CList
readCons' [] [] []                    = (CList [] [])
readCons' [] [] pc                    = (CList [] pc)
readCons' [] ac []                    = (CList ac [])
readCons' [] ac pc                    = (CList ac pc)
readCons' (c:cs) ac pc | isActive con = (readCons' cs ([con] ++ ac) pc)
                       | otherwise    = (readCons' cs ac ([con] ++ pc))
   where con = readCon c

readCon :: String -> Connection
readCon s | (sp == 0) && (tp == 0) = (Active (readAgent (comps !! 0)) (readAgent (comps !! 1)) sp tp)
          | otherwise              = (Passive (readAgent (comps !! 0)) (readAgent (comps !! 1)) sp tp)
   where 
        comps = (splitOn s '(' [])
        sp = read (comps !! 2)
        tp = read (comps !! 3)

isActive :: Connection -> Bool
isActive (Active _ _ _ _)  = True
isActive (Passive _ _ _ _) = False 

--split a string into a list of strings at specified character
splitOn :: String -> Char -> String -> [String]
splitOn [] _ []          = []
splitOn [] _ rem         = [rem]
splitOn (str:strs) c rem | str == c    = [rem] ++ (splitOn strs c [])
                         | otherwise   = (splitOn strs c (rem ++ [str]))

netToString :: INet -> String
netToString (INet a r ac pc) = (agentListToString a) ++ ":" ++ (ruleListToString r) ++ ":" ++ (conListsToString ac pc)

agentListToString :: [Agent] -> String
agentListToString []     = []
agentListToString (a:as) = (agentToString a) ++ ")" ++ (agentListToString as)

--no handling for value as it has been deprecated
agentToString :: Agent -> String
agentToString (Agent arity value name (Portlist portlist) id) = (show arity) ++ "." ++ (name) ++ "." ++ (show portlist) ++ "." ++  (show id) 

ruleListToString :: [Rule] -> String
ruleListToString []     = []
ruleListToString (r:rs) = (ruleToString r) ++ "*" ++ (ruleListToString rs)

ruleToString :: Rule -> String
ruleToString (Rule a1 a2 rnet) = (agentToString a1) ++ "~" ++ (agentToString a2) ++ "~" ++ (rNetToString rnet)

rNetToString :: RNet -> String
rNetToString (RNet a ac pc f) = (agentListToString a) ++ "-" ++ (conListsToString ac pc) ++ "-" ++ (freeportToString f)

freeportToString :: Freeport -> String
freeportToString (Freeport [] [])                                                               = []
freeportToString (Freeport ((sourceA, sourceP):(sourcelist)) ((targetA, targetP):(targetlist))) = (agentToString sourceA) ++ "|" ++ (show sourceP) ++ "|" ++ (agentToString targetA) ++ "|" ++ (show targetP) ++ "$" ++ (freeportToString (Freeport sourcelist targetlist))

conListsToString :: [Connection] -> [Connection] -> String
conListsToString [] []         = []
conListsToString [] (c:cs)     = (conToString c) ++ "!"  ++ (conListsToString [] cs)
conListsToString (c:cs) []     = (conToString c) ++ "!" ++ (conListsToString cs [])
conListsToString (a:ac) (p:pc) = (conToString a) ++ "!"  ++ (conToString p) ++ "!"  ++ (conListsToString ac pc)

-- goes a1 a2 sourceport targetport
conToString :: Connection -> String
conToString (Passive a1 a2 s t) = (agentToString a1) ++ "("  ++ (agentToString a2) ++ "(" ++  show s ++ "(" ++  show t 
conToString (Active a1 a2 s t)  = (agentToString a1) ++ "("  ++ (agentToString a2) ++ "(" ++  show s ++ "(" ++  show t 

resetLog :: INet -> IO ()
resetLog inet = writeFile "store.txt" (netToString inet)

testy :: String
testy = "0.0.[].0)0.Erase.[].1)5.y.[1,2,3,4,5].2)3.x.[0,2,3].3):0.0.[].0~2.Mult.[].4~0.0.[].0)0.Erase.[].1)--2.Mult.[].4^1^0.Erase.[].1^0$2.Mult.[].4^2^0.0.[].0^0$*:5.y.[1,2,3,4,5].2(0.Erase.[].1(0(0!3.x.[0,2,3].3(0.0.[].0(1(0!"
testy2 :: [Connection] 
testy2 =  [erasey, zeromult] 
testy3 :: [Connection]
testy3 = [xmult, ymult] 


main = do
  contents <- readFile  "store.txt"
  print (netToString (reduce (readNet contents)))
  
